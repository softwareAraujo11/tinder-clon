// components/AuthMenu.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../services/firebase';
import { syncUserWithBackend } from '../utils/syncUser';

const AuthMenu = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      if (!result || !result.user) {
        throw new Error('No user information returned from Firebase.');
      }

      const res = await syncUserWithBackend(result.user);

      if (res?.exists) {
        navigate('/chat');
      } else {
        navigate('/complete-profile', { state: { user: res.user } });
      }
    } catch (error) {
      console.error('Google login error:', error);
      alert('Google login failed: ' + error.message);
    }
  };

  return (
    <div className="auth-menu">
      <h2>Welcome to Tinder Clone</h2>
      <button onClick={handleGoogleLogin}>Login with Google</button>
      <br /><br />
      <button onClick={() => navigate('/login')}>Login with Email</button>
      <button onClick={() => navigate('/register')}>Register with Email</button>
    </div>
  );
};

export default AuthMenu;
