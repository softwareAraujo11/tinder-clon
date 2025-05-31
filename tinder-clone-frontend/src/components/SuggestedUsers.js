// components/SuggestedUsers.js
import React, { useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/SuggestedUsers.css';

const SuggestedUsers = ({ refreshTrigger }) => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [currentUserUuid, setCurrentUserUuid] = useState(null);

  const fetchSuggestedUsers = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const resUsers = await fetch('http://localhost:3000/api/users');
      const users = await resUsers.json();
      const mongoUser = users.find((u) => u.email === currentUser.email);
      if (!mongoUser) return;

      setCurrentUserUuid(mongoUser.uuid);

      const res = await fetch(`http://localhost:3000/api/users/suggested/${mongoUser.uuid}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setSuggestedUsers(data);
        if (data.length === 0) {
          toast.info('No hay más sugerencias por ahora.', { position: 'top-center' });
        }
      } else {
        console.error('Respuesta inesperada del backend:', data);
        setSuggestedUsers([]);
        toast.error('Error inesperado al obtener sugerencias.');
      }
    } catch (error) {
      console.error('Error al obtener sugerencias:', error);
      setSuggestedUsers([]);
      toast.error('No se pudieron cargar las sugerencias.');
    }
  };

  useEffect(() => {
    fetchSuggestedUsers();
  }, [refreshTrigger]);

  const handleLike = async (targetUuid) => {
    if (!currentUserUuid || !targetUuid) return;

    try {
      const res = await fetch('http://localhost:3000/api/swipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originUserUuid: currentUserUuid,
          targetUserUuid: targetUuid,
          action: 'like'
        })
      });

      const result = await res.json();

      if (res.ok) {
        setSuggestedUsers((prev) => prev.filter((user) => user.uuid !== targetUuid));

        if (result.match) {
          toast.success('¡Es un match! 🎉 Ahora pueden chatear.', { position: 'top-center' });
        } else {
          toast.info('¡Like enviado!', { position: 'top-center' });
        }
      } else {
        toast.error('No se pudo registrar el like.');
      }
    } catch (error) {
      console.error('Error al enviar like:', error);
      toast.error('Error al enviar like.');
    }
  };

  return (
    <div className="suggested-container">
      <h2 className="suggested-title">Usuarios Sugeridos</h2>
      {Array.isArray(suggestedUsers) && suggestedUsers.length > 0 ? (
        <div className="suggested-grid">
          {suggestedUsers.map((user) => (
            <div key={user.uuid} className="suggested-card">
              <img
                src={user.profilePicture?.trim()
                  ? user.profilePicture
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ff5864&color=fff&size=128`}
                alt={user.name}
                className="suggested-img"
              />
              <h3>{user.name}</h3>
              <p className="suggested-location">{user.location}</p>

              {user.interests && user.interests.length > 0 && (
                <div className="interests-container">
                  {user.interests.map((interest, index) => (
                    <span key={index} className="interest-chip">{interest}</span>
                  ))}
                </div>
              )}

              <button onClick={() => handleLike(user.uuid)} className="like-button">
                ❤️ Me gusta
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-suggestions">No hay más sugerencias por ahora.</p>
      )}
    </div>
  );
};

export default SuggestedUsers;
