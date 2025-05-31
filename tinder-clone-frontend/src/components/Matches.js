// components/Matches.js
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Matches.css';

const Matches = ({ onMatchRemoved }) => {
  const [matches, setMatches] = useState([]);
  const toastShown = useRef(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleDislike = async (targetUuid) => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return;

    try {
      const resUsers = await fetch('http://localhost:3000/api/users');
      const users = await resUsers.json();
      const mongoUser = users.find((u) => u.email === firebaseUser.email);
      if (!mongoUser || !mongoUser.uuid) return;

      const deleteMatchRes = await fetch('http://localhost:3000/api/matches', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userUuid1: mongoUser.uuid,
          userUuid2: targetUuid,
        }),
      });

      const deleteSwipeRes = await fetch('http://localhost:3000/api/swipes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originUserUuid: mongoUser.uuid,
          targetUserUuid: targetUuid,
        }),
      });

      if (deleteMatchRes.ok && deleteSwipeRes.ok) {
        toast.success('Match eliminado.');
        setMatches((prev) => prev.filter((m) => m.uuid !== targetUuid));
        if (onMatchRemoved) onMatchRemoved(targetUuid);
      } else {
        toast.error('Error al eliminar el match o el like.');
      }
    } catch (error) {
      console.error('Error al eliminar match:', error);
      toast.error('Error al eliminar el match.');
    }
  };

  return (
    <div className="matches-container">
      <h2 className="matches-title">Tus matches</h2>
      {matches.length > 0 ? (
        <div className="matches-grid">
          {matches.map((match) => (
            <div key={match.matchId} className="matches-card">
              <img
                src={match.profilePicture}
                alt={match.name}
                className="matches-img"
                onError={(e) => {
                  e.target.src = '/default-avatar.png';
                }}
              />
              <div className="matches-info">
                <h4 className="matches-name">{match.name}</h4>
                <p className="matches-location">{match.location}</p>
              </div>
              <div className="matches-button-group">
                <button
                  onClick={() => navigate(`/chat/${match.uuid}`)}
                  className="matches-button chat"
                >
                  Chatear
                </button>
                <button
                  onClick={() => handleDislike(match.uuid)}
                  className="matches-button dislike"
                >
                  Dislike
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="matches-no-matches">Aún no tienes matches.</p>
      )}
    </div>
  );
};

export default Matches;
