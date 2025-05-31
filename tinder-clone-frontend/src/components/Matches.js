// components/Matches.js
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Matches.css';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const toastShown = useRef(false); // 🔑

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return;

      try {
        const resUsers = await fetch('http://localhost:3000/api/users');
        const users = await resUsers.json();

        const mongoUser = users.find((u) => u.email === firebaseUser.email);
        if (!mongoUser || !mongoUser.uuid) {
          toast.error('No se pudo obtener el usuario autenticado.');
          return;
        }

        const res = await fetch(`http://localhost:3000/api/matches?userUuid=${mongoUser.uuid}`);
        const matchedUsers = await res.json();

        if (!matchedUsers.length && !toastShown.current) {
          toast.info('Aún no tienes matches. Sigue buscando 👀');
          toastShown.current = true;
        }

        const formatted = matchedUsers.map((user) => ({
          matchId: user._id,
          uuid: user.uuid,
          name: user.name,
          location: user.location,
          profilePicture: user.profilePicture?.trim()
            ? user.profilePicture
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ff5864&color=fff&size=128`,
        }));

        setMatches(formatted);
      } catch (error) {
        console.error('Error al obtener matches:', error);
        toast.error('No se pudieron cargar tus matches.');
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="matches-container">
      <h2 className="matches-title">Tus matches</h2>
      {matches.length > 0 && (
        <div className="matches-grid">
          {matches.map((match) => (
            <div key={match.matchId} className="match-card">
              <img
                src={match.profilePicture}
                alt={match.name}
                className="match-img"
                onError={(e) => { e.target.src = '/default-avatar.png'; }}
              />
              <div className="match-info">
                <h4 className="match-name">{match.name}</h4>
                <p className="match-location">{match.location}</p>
              </div>
              <button onClick={() => navigate(`/chat/${match.uuid}`)} className="chat-button">
                Chatear
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
