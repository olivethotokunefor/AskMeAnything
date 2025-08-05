import React, { useState, useRef, useEffect } from 'react';
import './HeroSection.css';
import animation from '../assets/ai3.webm';
import send from "../assets/send.png";
import axios from 'axios';

const HeroSection = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]); // display user message immediately

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages: [
            { role: "system", content: "You are an information hub. Provide detailed and helpful information." },
            ...messages,
            userMsg
          ],
          temperature: 1,
          top_p: 1,
          max_tokens: 2048,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
        }
      );

      const aiReply = response.data.choices[0].message;
      setMessages(prev => [...prev, aiReply]);
    } catch (err) {
      console.error("OpenAI error:", err);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Please try again later.' }
      ]);
    }

    setInput('');
  };

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  return (
    <section className="hero">
      <div className="hero-content">
        {messages.length === 0 && (
          <>
            <video
              src={animation}
              autoPlay
              loop
              muted
              className="hero-animation"
            />
            <h1 className="hero-title">Ask Me Anything</h1>
            <p className="hero-subtitle">
              I'm your friendly AI assistant. Curious about science, need a recipe, or just want a joke? Type it in below!
            </p>
          </>
        )}

        <div className="chat-box" ref={chatRef}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat ${msg.role === 'user' ? 'user' : 'ai'}`}
            >
              {msg.content}
            </div>
          ))}
        </div>

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
