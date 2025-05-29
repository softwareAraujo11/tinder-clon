// components/Navbar.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userUuid, setUserUuid] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const res = await fetch('http://localhost:3000/api/users');
          const users = await res.json();
          const foundUser = users.find(u => u.email === currentUser.email);
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

  return (
    <nav>
      {user ? (
        <>
          <Link to="/app">Sugerencias</Link>
          <Link to="/matches">Matches</Link>
          {userUuid && (
            <Link to={`/chat?userId=${userUuid}`}>Chat</Link>
          )}
          <span>{user.displayName || user.email}</span>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </>
      ) : (
        <Link to="/login">Iniciar sesión</Link>
      )}
    </nav>
  );
};

export default Navbar;
