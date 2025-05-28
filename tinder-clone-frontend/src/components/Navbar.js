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
        } catch (error) {
          console.error('Error al obtener el uuid del usuario:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      {user ? (
        <>
          <Link to="/app" style={styles.link}>Sugerencias</Link>
          <Link to="/matches" style={styles.link}>Matches</Link>
          {userUuid && (
            <Link to={`/chat?userId=${userUuid}`} style={styles.link}>Chat</Link>
          )}
          <span style={styles.user}>👤 {user.displayName || user.email}</span>
          <button onClick={handleLogout} style={styles.button}>Cerrar sesión</button>
        </>
      ) : (
        <Link to="/login" style={styles.link}>Iniciar sesión</Link>
      )}
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#333',
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '18px',
    marginRight: '10px',
  },
  user: {
    color: '#ccc',
    marginLeft: '10px',
    fontSize: '14px',
  },
  button: {
    backgroundColor: '#555',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '4px',
    marginLeft: '10px',
  },
};

export default Navbar;
