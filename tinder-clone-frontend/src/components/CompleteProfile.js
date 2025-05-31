// components/CompleteProfile.js
import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/CompleteProfile.css';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [location, setLocation] = useState('Bogotá');
  const [interests, setInterests] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uuid, setUuid] = useState('');

  const interestOptions = [
    'Fútbol', 'Música', 'Viajes', 'Cine', 'Lectura', 'Tecnología', 'Moda', 'Videojuegos', 'Baile'
  ];

  const locationOptions = [
    'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Manizales', 'Pereira',
    'Ibagué', 'Santa Marta', 'Armenia', 'Cúcuta', 'Neiva', 'Tunja', 'Villavicencio', 'Popayán',
    'Pasto', 'Montería', 'Sincelejo', 'Riohacha', 'Quibdó', 'Florencia', 'Mocoa', 'Yopal',
    'San José del Guaviare', 'Inírida', 'Mitú', 'Leticia'
  ];

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setName(currentUser.displayName || '');
      setEmail(currentUser.email || '');
      setPassword(currentUser.uid || '');
      setUuid(currentUser.uid || '');
    }
  }, []);

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name,
      age: Number(age),
      gender,
      location,
      interests,
      email,
      password,
      uuid,
      profilePicture: user?.photoURL || '',
    };

    try {
      const response = await fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al registrar el perfil');

      toast.success('Perfil completado con éxito');
      navigate('/app');
    } catch (err) {
      toast.error('No se pudo completar el perfil');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <form onSubmit={handleSubmit} className="profile-form">
          <h2>Completa tu perfil</h2>

          <label>Nombre:</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />

          <label>Edad:</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />

          <label>Género:</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
          </select>

          <label>Ubicación:</label>
          <select value={location} onChange={(e) => setLocation(e.target.value)}>
            {locationOptions.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          <label>Intereses:</label>
          <div className="interests-group">
            {interestOptions.map((interest) => (
              <label key={interest} className="checkbox-label">
                <input
                  type="checkbox"
                  value={interest}
                  checked={interests.includes(interest)}
                  onChange={handleCheckboxChange}
                />
                {interest}
              </label>
            ))}
          </div>

          <button type="submit" className="auth-button">Guardar Perfil</button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
