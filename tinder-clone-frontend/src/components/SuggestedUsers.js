// components/SuggestedUsers.js
import React, { useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import '../styles/SuggestedUsers.css';

const SuggestedUsers = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [currentUserUuid, setCurrentUserUuid] = useState(null);

  useEffect(() => {
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
        } else {
          console.error('Respuesta inesperada del backend:', data);
          setSuggestedUsers([]);
        }
      } catch (error) {
        console.error('Error al obtener sugerencias:', error);
        setSuggestedUsers([]);
      }
    };

    fetchSuggestedUsers();
  }, []);

  const handleLike = async (targetUuid) => {
    if (!currentUserUuid || !targetUuid) return;

    try {
      await fetch('http://localhost:3000/api/swipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originUserUuid: currentUserUuid,
          targetUserUuid: targetUuid,
          action: 'like'
        })
      });

      setSuggestedUsers((prev) => prev.filter((user) => user.uuid !== targetUuid));
    } catch (error) {
      console.error('Error al enviar like:', error);
    }
  };

  return (
    <div className="suggested-container">
      <h2 className="suggested-title">Usuarios Sugeridos</h2>
      {Array.isArray(suggestedUsers) && suggestedUsers.length > 0 ? (
        <div className="suggested-grid">
          {suggestedUsers.map((user) => (
            <div key={user.uuid} className="suggested-card">
              <img src={user.profilePicture} alt={user.name} className="suggested-img" />
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
