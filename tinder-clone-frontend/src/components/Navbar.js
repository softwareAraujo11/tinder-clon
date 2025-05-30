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
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const res = await fetch(`http://localhost:3000/api/users/email/${currentUser.email}`);
          const data = await res.json();

          if (data) {
            setUserUuid(data.uuid);
            setUserName(data.name || currentUser.email);
          } else {
            setUserName(currentUser.email);
          }
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error);
          setUserName(currentUser.email);
        }
      }
    });

    return () => unsubscribe();
  }, [location.pathname]);

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
          <Link className="nav-user" to="/profile">{userName}</Link>
          <button className="nav-button" onClick={handleLogout}>Salir</button>
        </>
      ) : (
        <Link className="nav-link" to="/login">Iniciar sesión</Link>
      )}
    </nav>
  );
};

export default Navbar;
