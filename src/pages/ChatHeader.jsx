import React from 'react';
import './ChatHeader.css';
import logo from '../assets/ai.png';
import profile from '../assets/user3.png';
import { doSignOut } from '../keys/auth';
import { useNavigate } from 'react-router-dom';

const ChatHeader = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await doSignOut();
      navigate('/'); // or '/login' depending on your routes
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <header className="chat-header">
      <div className="header-left">
        <img src={logo} alt="AI Logo" className="logo" />
        <span className="app-name">Luma.AI</span>
      </div>
      <div className="header-right">
        <img src={profile} alt="User Profile" className="profile-pic" />
        <button className="sign-out" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
