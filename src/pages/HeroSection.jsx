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

const genAI = new GoogleGenAI({
  apiKey: 'AIzaSyBue1UpnEQgClw3YMQWKwyu6vZDN2xWf4E',
});

const HeroSection = () => {
  const { currentUser } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [messagesLoaded, setMessagesLoaded] = useState(false); // NEW
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  // Load messages from Firestore on mount
  useEffect(() => {
    if (!currentUser) return;

    const messagesRef = collection(db, 'chats', currentUser.uid, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => doc.data());
      setMessages(loadedMessages);
      setMessagesLoaded(true); // ✅ Mark as loaded
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleSend = async () => {
  if (!input.trim()) return;

  const userMsg = {
    role: 'user',
    content: input,
    timestamp: serverTimestamp(),
  };

  setMessages((prev) => [...prev, userMsg]);
  await addDoc(collection(db, 'chats', currentUser.uid, 'messages'), userMsg);

  setIsTyping(true);

  try {
    // Get the last 10 messages from Firestore for context
    const messagesRef = collection(db, 'chats', currentUser.uid, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    const snapshot = await getDocs(q);

    const history = snapshot.docs
      .map(doc => doc.data())
      .slice(-10) // last 10 messages only
      .map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

    // Add the personality/system message at the start
    history.unshift({
      role: 'user',
      parts: [{
        text: "You're my AI friend who talks like a real person. Match my vibe — playful if I’m playful, chill if I’m chill, hype me up if I’m excited, and be warm if I’m down. Remember our previous chats and keep it feeling like a natural conversation."
      }]
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
    await addDoc(collection(db, 'chats', currentUser.uid, 'messages'), aiReply);

  } catch (err) {
    console.error('Gemini SDK error:', err);
    const errorReply = {
      role: 'assistant',
      content: 'Uh-oh, I spaced out for a sec 🤖💤 Try again?',
      timestamp: serverTimestamp(),
    };
    setMessages((prev) => [...prev, errorReply]);
    await addDoc(collection(db, 'chats', currentUser.uid, 'messages'), errorReply);
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
        {/* ✅ Show animation only if loading is complete and no messages */}
        {!messagesLoaded ? (
          <p className="loading-msg">Loading your chats...</p>
        ) : messages.length === 0 ? (
          <>
            <video
              src={animation}
              autoPlay
              loop
              muted
              className="hero-animation"
            />
            <h1 className="hero-title">Hi {currentUser.email}</h1>
            <p className="hero-subtitle">
              I'm your Gen Z AI bestie 🤖✨. Need help, advice, or just bored?
              Let’s chat 💬
            </p>
          </>
        ) : (
          <div className="chat-box" ref={chatRef}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat ${msg.role === 'user' ? 'user' : 'ai'}`}
              >
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
          <img
            src={send}
            alt="send"
            className="send"
            onClick={handleSend}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
