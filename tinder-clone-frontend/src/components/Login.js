// components/Login.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { syncUserWithBackend } from '../utils/syncUser';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const res = await syncUserWithBackend(userCredential.user);

      toast.success('Inicio de sesión exitoso');

      if (res?.exists) {
        navigate('/app');
      } else {
        navigate('/complete-profile', { state: { user: res.user } });
      }
    } catch (err) {
      toast.error('Error al iniciar sesión: ' + err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button className="close-button" onClick={() => navigate('/login')}>
          ×
        </button>
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Contraseña"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            className="auth-input"
          />
          <button type="submit" className="auth-button">Iniciar sesión</button>
        </form>
        <p style={{ marginTop: '1rem' }}>
          ¿No tienes cuenta?{' '}
          <span
            style={{ color: '#ff5864', cursor: 'pointer' }}
            onClick={() => navigate('/register')}
          >
            Regístrate
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
