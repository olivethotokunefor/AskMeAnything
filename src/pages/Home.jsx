import React from 'react';
import './Home.css';
import ChatHeader from './ChatHeader';
import background from '../assets/dark4.jpg'; // Correct relative path
import HeroSection from './HeroSection';

const Home = () => {
  return (
    <div
      className="con"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
backdropFilter: blur(10),
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100%',
      }}
    >
      <ChatHeader />
      <HeroSection/>
    </div>
  );
};

export default Home;
