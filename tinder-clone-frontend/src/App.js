// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
import UserProfile from './components/UserProfile';

// Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      const currentPath = window.location.pathname;

      if (!user) {
        setIsAuthenticated(false);
        setProfileComplete(false);
        if (!['/login', '/login-email', '/register'].includes(currentPath)) {
          navigate('/login');
        }
      } else {
        setIsAuthenticated(true);
        try {
          const res = await fetch(`http://localhost:3000/api/users/email/${user.email}`);
          const mongoUser = await res.json();

          const isComplete =
            mongoUser &&
            mongoUser.age &&
            mongoUser.gender &&
            mongoUser.location &&
            mongoUser.interests &&
            mongoUser.interests.length > 0;

          setProfileComplete(isComplete);

          if (!isComplete && currentPath !== '/complete-profile') {
            navigate('/complete-profile');
          }

          if (isComplete && ['/login', '/login-email', '/register', '/'].includes(currentPath)) {
            navigate('/app');
          }
        } catch (error) {
          setIsAuthenticated(false);
          setProfileComplete(false);
          navigate('/login');
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <>
      {isAuthenticated && profileComplete && !['/login', '/login-email', '/register'].includes(location.pathname) && (
        <Navbar />
      )}
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
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </div>
      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar />
    </>
  );
};

const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;
