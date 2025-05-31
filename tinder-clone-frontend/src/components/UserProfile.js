// components/UserProfile.js
import React, { useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    interests: [],
    profilePicture: '',
  });
  const [uuid, setUuid] = useState('');
  const [allInterests] = useState([
    'Deportes', 'Música', 'Cine', 'Viajes', 'Lectura', 'Cocina', 'Arte', 'Tecnología'
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      try {
        const res = await fetch(`http://localhost:3000/api/users/email/${currentUser.email}`);
        const data = await res.json();

        setUuid(data.uuid);
        setFormData({
          name: data.name || '',
          location: data.location || '',
          interests: data.interests || [],
          profilePicture: data.profilePicture || '',
        });
      } catch (error) {
        console.error('Error al cargar perfil:', error);
        toast.error('No se pudo cargar tu perfil.');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleInterestToggle = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uuid) {
      toast.error('No se encontró tu usuario.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/users/${uuid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Perfil actualizado correctamente.');
      } else {
        toast.error('Error al actualizar el perfil.');
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      toast.error('Error al actualizar el perfil.');
    }
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-preview">
        <h2>Editar Perfil</h2>
        <div className="preview-box">
          {formData.profilePicture ? (
            <img src={formData.profilePicture} alt="Preview" className="profile-picture-preview" />
          ) : (
            <div style={{ lineHeight: '220px', color: '#aaa' }}>Sin imagen</div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <label>
          Nombre:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>

        <label>
          Ubicación:
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </label>

        <label>
          Foto de Perfil (URL):
          <input type="text" name="profilePicture" value={formData.profilePicture} onChange={handleChange} />
        </label>

        <div className="interests-section">
          <p>Intereses:</p>
          <div className="interests-grid">
            {allInterests.map((interest) => (
              <label key={interest} className="interest-item">
                <input
                  type="checkbox"
                  checked={formData.interests.includes(interest)}
                  onChange={() => handleInterestToggle(interest)}
                />
                {interest}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="save-button">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default UserProfile;
