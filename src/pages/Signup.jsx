import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './Signup.css';
import ai from '../assets/ai.png';
import videoBg from '../assets/grad2.mp4';
import { useAuth } from '../contexts/authContext';
import { doCreateUserWithEmailAndPassword, doSignInWithGoogle } from '../keys/auth';

const Signup = () => {
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (!isRegistering) {
      setIsRegistering(true);
      try {
        await doCreateUserWithEmailAndPassword(email, password);
      } catch (err) {
        setErrorMessage(err.message);
      } finally {
        setIsRegistering(false);
      }
    }
  };

  const onGoogleSignIn = (e) => {
    e.preventDefault();
    if (!isRegistering) {
      setIsRegistering(true);
      doSignInWithGoogle()
        .catch((err) => {
          setErrorMessage(err.message);
          setIsRegistering(false);
        });
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
        <h1>Sign Up</h1>

        <form className="inputs" onSubmit={onSubmit}>
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

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {errorMessage && <p className="error">{errorMessage}</p>}

          <button
            type="submit"
            className="button"
            disabled={isRegistering}
          >
            {isRegistering ? 'Signing Up...' : 'Sign Up'}
          </button>

          <button
            type="button"
            className="google-signin"
            onClick={onGoogleSignIn}
            disabled={isRegistering}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google Logo"
              className="google-logo"
            />
            Sign in with Google
          </button>
        </form>

        <p className="log">
          Already have an account?
          <Link to="/login" className="link"> Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
