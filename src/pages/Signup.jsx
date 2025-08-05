import React from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';
import ai from '../assets/ai.png';
import videoBg from '../assets/grad2.mp4'; 

const Signup = () => {
  return (
    <div className="container">
      
      <video src={videoBg} autoPlay loop muted className="background-video" />

      
      <div className="wrapper">
        <img src={ai} alt="AI Logo" className="logo" />
        <h1>Sign Up</h1>
        <div className="inputs">
          <input type="text" placeholder="Username" />
          <input type="text" placeholder="Email" />
          <input type="password" placeholder="Password" />
        </div>
        <Link to="/home">
          <button className="button">Sign Up</button>
        </Link>
        <p className="log">
          Already have an account?
          <Link to="/login" className="link"> Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
