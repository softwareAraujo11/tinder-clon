// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { auth } from './services/firebase';
import Navbar from './components/Navbar';
import SuggestedUsers from './components/SuggestedUsers';
import Matches from './components/Matches';
import ChatSelector from './components/ChatSelector';
import Chat from './components/Chat';
import AuthMenu from './components/AuthMenu';
import CompleteProfile from './components/CompleteProfile';
import Login from './components/Login';
import Register from './components/Register';

const AppRoutes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      const currentPath = window.location.pathname;

      if (!user) {
        if (!['/login', '/login-email', '/register'].includes(currentPath)) {
          navigate('/login');
        }
      } else {
        try {
          const res = await fetch(`http://localhost:3000/api/users/email/${user.email}`);
          const mongoUser = await res.json();

          const isProfileComplete =
            mongoUser &&
            mongoUser.age &&
            mongoUser.gender &&
            mongoUser.location &&
            mongoUser.interests &&
            mongoUser.interests.length > 0;

          if (!isProfileComplete && currentPath !== '/complete-profile') {
            navigate('/complete-profile');
          }

          if (isProfileComplete && ['/login', '/login-email', '/register', '/'].includes(currentPath)) {
            navigate('/app');
          }
        } catch (error) {
          navigate('/login');
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div>
        <Routes>
          <Route path="/login" element={<AuthMenu />} />
          <Route path="/login-email" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/app" element={<SuggestedUsers />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/chat" element={<ChatSelector />} />
          <Route path="/chat/:userUuid" element={<Chat />} />
        </Routes>
      </div>
    </>
  );
};

const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;
