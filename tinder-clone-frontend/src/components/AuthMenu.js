// components/AuthMenu.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../services/firebase';
import { syncUserWithBackend } from '../utils/syncUser';
import '../styles/AuthMenu.css';

import tinderLogo from '../images/tinder.png';
import googleIcon from '../images/google.png';

const AuthMenu = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      if (!result || !result.user) throw new Error('No user information returned from Firebase.');

      const res = await syncUserWithBackend(result.user);
      navigate(res?.exists ? '/chat' : '/complete-profile', { state: { user: res.user } });
    } catch (error) {
      alert('Google login failed: ' + error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={tinderLogo} alt="Tinder Logo" className="auth-logo" />
        <h2>Find Your Match</h2>
        <p className="auth-subtitle">Login to start swiping</p>

        <button className="auth-button google" onClick={handleGoogleLogin}>
          <img src={googleIcon} alt="Google Icon" className="google-icon" />
          Continue with Google
        </button>

        <div className="divider">OR</div>

        <button className="auth-button" onClick={() => navigate('/login-email')}>
          Login with Email
        </button>
        <button className="auth-button secondary" onClick={() => navigate('/register')}>
          Register New Account
        </button>
      </div>
    </div>
  );
};

export default AuthMenu;
