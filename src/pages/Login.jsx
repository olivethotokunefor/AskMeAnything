import React from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';
import ai from '../assets/ai.png';
import videoBg from '../assets/grad2.mp4'; 

const Login = () => {
  return (
    <div className="container">
      
      <video src={videoBg} autoPlay loop muted className="background-video" />

      
      <div className="wrapper">
        <img src={ai} alt="AI Logo" className="logo" />
        <h1>Log In</h1>
        <div className="inputs">
          <input type="text" placeholder="Email" />
          <input type="password" placeholder="Password" />
        </div>
        <Link to="/home">
          <button className="button">Log In</button>
        </Link>
        <p className="log">
          New to LumaAI?
          <Link to="/login" className="link">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
