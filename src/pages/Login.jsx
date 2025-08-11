import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './Signup.css';
import ai from '../assets/ai.png';
import videoBg from '../assets/grad2.mp4';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../keys/auth';
import { useAuth } from '../contexts/authContext';

const Login = () => {
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      setErrorMessage('');

      try {
        await doSignInWithEmailAndPassword(email, password);
      } catch (err) {
        setErrorMessage(err.message);
        setIsSigningIn(false);
      }
    }
  };

  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      setErrorMessage('');

      try {
        await doSignInWithGoogle();
      } catch (err) {
        setErrorMessage(err.message);
        setIsSigningIn(false);
      }
    }
  };

  if (userLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="container">
      <video src={videoBg} autoPlay loop muted className="background-video" />

      <div className="wrapper">
        <img src={ai} alt="AI Logo" className="logo" />
        <h1>Log In</h1>

        {errorMessage && <p className="error">{errorMessage}</p>}

        <form onSubmit={onSubmit} className="inputs">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="button" type="submit" disabled={isSigningIn}>
            {isSigningIn ? 'Signing in...' : 'Log In'}
          </button>
        </form>

     <button
  type="button"
  className="google-signin"
  onClick={onGoogleSignIn}
  disabled={isSigningIn}
>
  <img
    src="https://developers.google.com/identity/images/g-logo.png"
    alt="Google Logo"
    className="google-logo"
  />
  Sign in with Google
</button>



        <p className="log">
          New to LumaAI?{' '}
          <Link to="/" className="link">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
