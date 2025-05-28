// components/ChatSelector.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';

const ChatSelector = () => {
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      try {
        // Obtener todos los usuarios para encontrar el actual
        const resUsers = await fetch('http://localhost:3000/api/users');
        const users = await resUsers.json();
        const mongoUser = users.find((u) => u.email === currentUser.email);

        if (!mongoUser) return;

        // Obtener matches del usuario usando UUID
        const res = await fetch(`http://localhost:3000/api/matches?userUuid=${mongoUser.uuid}`);
        const matchesData = await res.json();

        // Filtrar los datos del otro usuario en el match
        const formattedMatches = matchesData.map((match) => {
          const otherUuid =
            match.user1Uuid === mongoUser.uuid ? match.user2Uuid : match.user1Uuid;
          const otherUser = users.find((u) => u.uuid === otherUuid);

          return {
            matchId: match._id,
            uuid: otherUser?.uuid,
            name: otherUser?.name || 'Usuario',
            location: otherUser?.location || 'Desconocida',
            profilePicture: otherUser?.profilePicture || '',
          };
        });

        setMatches(formattedMatches);
      } catch (error) {
        console.error('Error al obtener matches:', error);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div>
      <h2>Selecciona un match para chatear</h2>
      {matches.length === 0 ? (
        <p>No tienes matches todavía.</p>
      ) : (
        <ul>
          {matches.map((match) => (
            <li key={match.matchId}>
              <img src={match.profilePicture} alt={match.name} width={50} />
              <strong>{match.name}</strong> - {match.location}
              <br />
              <button onClick={() => navigate(`/chat/${match.uuid}`)}>Chatear</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatSelector;
