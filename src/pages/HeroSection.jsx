import React, { useState, useRef, useEffect } from 'react';
import './HeroSection.css';
import animation from '../assets/ai3.webm';
import send from '../assets/send.png';
import { GoogleGenAI } from '@google/genai';


const genAI = new GoogleGenAI({apiKey:"AIzaSyBue1UpnEQgClw3YMQWKwyu6vZDN2xWf4E"});

const HeroSection = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const chatRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
setIsTyping(true);

    try {
      const response = await genAI.models.generateContent({ model: "gemini-2.5-flash",contents:input });
      // const result = await model.generateContent(input);
      const text = response.text;

      const aiReply = { role: 'assistant', content: text };
      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);

    } catch (err) {
      console.error('Gemini SDK error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Please try again later.' },
      ]);
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
        {messages.length === 0 ? (
          <>
            <video src={animation} autoPlay loop muted className="hero-animation" />
            <h1 className="hero-title">Ask Me Anything</h1>
            <p className="hero-subtitle">
              I'm your friendly AI assistant. Curious about science, need a recipe, or just want a joke? Type it in below!
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
