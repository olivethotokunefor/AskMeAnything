import React, { useState, useRef, useEffect } from 'react';
import './HeroSection.css';
import animation from '../assets/ai3.webm';
import send from '../assets/send.png';
import { GoogleGenAI } from '@google/genai';
import { useAuth } from '../contexts/authContext';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  getDocs
} from 'firebase/firestore';
import { db } from '../keys/FirebaseAuth';



// 🎯 Define personalities for each category
// 🎯 Define personalities for each category
const categoryPrompts = {
  "Creative AI": "You're my artsy, fun AI friend. Be imaginative, witty, and full of creative ideas for design, art, and writing.",
  "Business AI": "You're my savvy business partner. Be concise, professional, and full of strategic insights.",
  "Developer Tools": "You're my coding buddy. Explain things clearly, give helpful code snippets, and think like a developer.",
  "Education AI": "You're my learning coach. Be encouraging, explain concepts step-by-step, and give practical examples.",

  "Personal Growth AI": "You're my motivational coach and accountability partner. Help me set goals, build habits, and stay positive. Be inspiring but practical.",
  "Health & Wellness AI": "You're my friendly wellness buddy. Share fitness ideas, healthy eating tips, and mindfulness exercises. Keep it encouraging and safe — no medical advice.",
  "Storyteller AI": "You're the master of interactive storytelling. Create vivid, engaging tales, roleplays, and adventures based on my prompts.",
  "Productivity Pro AI": "You're my productivity strategist. Help me plan my day, prioritize tasks, and stay focused with proven efficiency techniques.",
  "Travel & Culture AI": "You're my virtual travel guide. Share travel tips, cultural insights, local food suggestions, and unique experiences from around the world.",
  "Fun Facts & Curiosity AI": "You're my curiosity spark. Share fascinating facts, trivia, and surprising knowledge in a fun, engaging way.",
  "Career Coach AI": "You're my career growth mentor. Give me resume tips, interview prep, networking advice, and guidance for advancing my career."
};

const HeroSection = () => {
  const { currentUser } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  // ✅ Get selected category from localStorage
  const selectedCategory = localStorage.getItem("selectedCategory") || "Creative AI";

  useEffect(() => {
    if (!currentUser) return;

    const messagesRef = collection(db, 'chats', currentUser.uid, 'messages', selectedCategory, 'history');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => doc.data());
      setMessages(loadedMessages);
      setMessagesLoaded(true);
    });

    return () => unsubscribe();
  }, [currentUser, selectedCategory]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = {
      role: 'user',
      content: input,
      timestamp: serverTimestamp(),
    };

    setMessages((prev) => [...prev, userMsg]);
    await addDoc(collection(db, 'chats', currentUser.uid, 'messages', selectedCategory, 'history'), userMsg);

    setIsTyping(true);

    try {
      const messagesRef = collection(db, 'chats', currentUser.uid, 'messages', selectedCategory, 'history');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));
      const snapshot = await getDocs(q);

      const history = snapshot.docs
        .map(doc => doc.data())
        .slice(-10)
        .map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }));

      // Inject category personality at start
      history.unshift({
        role: 'user',
        parts: [{ text: categoryPrompts[selectedCategory] }]
      });

      const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: history
      });

      const text = response.candidates[0].content.parts[0].text;

      const aiReply = {
        role: 'assistant',
        content: text,
        timestamp: serverTimestamp(),
      };

      setMessages((prev) => [...prev, aiReply]);
      await addDoc(collection(db, 'chats', currentUser.uid, 'messages', selectedCategory, 'history'), aiReply);

    } catch (err) {
      console.error('Gemini SDK error:', err);
      const errorReply = {
        role: 'assistant',
        content: 'Uh-oh, I spaced out for a sec 🤖💤 Try again?',
        timestamp: serverTimestamp(),
      };
      setMessages((prev) => [...prev, errorReply]);
      await addDoc(collection(db, 'chats', currentUser.uid, 'messages', selectedCategory, 'history'), errorReply);
    }

    setInput('');
    setIsTyping(false);
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <section className="hero">
      <div className="hero-content">
        {!messagesLoaded ? (
          <p className="loading-msg">Loading your chats...</p>
        ) : messages.length === 0 ? (
          <>
            <video src={animation} autoPlay loop muted className="hero-animation" />
            <h1 className="hero-title">Hi {currentUser?.email}</h1>
            <p className="hero-subtitle">
              Welcome to {selectedCategory}! Let's make something amazing.
            </p>
          </>
        ) : (
          <div className="chat-box" ref={chatRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`chat ${msg.role === 'user' ? 'user' : 'ai'}`}>
                {msg.content}
              </div>
            ))}
            {isTyping && (
              <div className="chat ai typing-indicator">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}
          </div>
        )}

        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Type something..."
            className="hero-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <img src={send} alt="send" className="send" onClick={handleSend} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
