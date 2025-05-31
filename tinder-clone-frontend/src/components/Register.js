// components/Register.js
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      toast.success(`Usuario registrado: ${userCredential.user.email}`);
      navigate('/complete-profile');
    } catch (err) {
      toast.error('Error al registrarse: ' + err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button className="close-button" onClick={() => navigate('/login')}>
          ×
        </button>
        <h2>Regístrate</h2>
        <form onSubmit={handleRegister}>
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
          <button type="submit" className="auth-button">Registrarse</button>
        </form>
        <p style={{ marginTop: '1rem' }}>
          ¿Ya tienes cuenta?{' '}
          <span
            style={{ color: '#ff5864', cursor: 'pointer' }}
            onClick={() => navigate('/login-email')}
          >
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
