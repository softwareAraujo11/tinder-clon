// components/Navbar.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../services/firebase';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [userUuid, setUserUuid] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const res = await fetch('http://localhost:3000/api/users');
          const users = await res.json();
          const foundUser = users.find((u) => u.email === currentUser.email);
          if (foundUser) setUserUuid(foundUser.uuid);
        } catch (error) {}
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  if (['/login', '/login-email', '/register'].includes(location.pathname)) return null;

  return (
    <nav className="navbar">
      {user ? (
        <>
          <Link className="nav-link" to="/app">Sugerencias</Link>
          <Link className="nav-link" to="/matches">Matches</Link>
          {userUuid && (
            <Link className="nav-link" to={`/chat?userId=${userUuid}`}>Chat</Link>
          )}
          <span className="nav-user">{user.displayName || user.email}</span>
          <button className="nav-button" onClick={handleLogout}>Salir</button>
        </>
      ) : (
        <Link className="nav-link" to="/login">Iniciar sesión</Link>
      )}
    </nav>
  );
};

export default Navbar;
