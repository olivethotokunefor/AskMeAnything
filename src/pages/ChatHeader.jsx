import React from 'react';
import './ChatHeader.css';
import logo from '../assets/ai.png'; // your AI logo
import profile from '../assets/user3.png'; // default profile pic

const ChatHeader = () => {
  return (
    <header className="chat-header">
      <div className="header-left">
        <img src={logo} alt="AI Logo" className="logo" />
        <span className="app-name">Luma.AI</span>
      </div>
      <div className="header-right">
        <img src={profile} alt="User Profile" className="profile-pic" />
        <button className="sign-out">Sign Out</button>
      </div>
    </header>
  );
};

export default ChatHeader;
