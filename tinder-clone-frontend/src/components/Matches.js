// components/Matches.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import '../styles/Matches.css';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return;

      try {
        const resUsers = await fetch('http://localhost:3000/api/users');
        const users = await resUsers.json();

        const mongoUser = users.find((u) => u.email === firebaseUser.email);
        if (!mongoUser || !mongoUser.uuid) return;

        const res = await fetch(`http://localhost:3000/api/matches?userUuid=${mongoUser.uuid}`);
        const matchedUsers = await res.json();

        const formatted = matchedUsers.map((user) => ({
          matchId: user._id,
          uuid: user.uuid,
          name: user.name,
          location: user.location,
          profilePicture: user.profilePicture || '',
        }));

        setMatches(formatted);
      } catch (error) {
        console.error('Error al obtener matches:', error);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="matches-container">
      <h2 className="matches-title">Tus matches</h2>
      {matches.length === 0 ? (
        <p className="no-matches">Aún no tienes matches.</p>
      ) : (
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
