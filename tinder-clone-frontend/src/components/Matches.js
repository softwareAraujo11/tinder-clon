// components/Matches.js
import React, { useEffect, useState } from 'react';
import { auth } from '../services/firebase';

const Matches = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return;

      try {
        const resUsers = await fetch('http://localhost:3000/api/users');
        const users = await resUsers.json();
        const mongoUser = users.find((u) => u.email === firebaseUser.email);

        if (!mongoUser || !mongoUser.uuid) {
          console.warn('Usuario no encontrado en MongoDB');
          return;
        }

        const res = await fetch(`http://localhost:3000/api/matches?userUuid=${mongoUser.uuid}`);
        const otherUsers = await res.json();

        console.log('UUID actual:', mongoUser.uuid);
        console.log('Usuarios encontrados en matches:', otherUsers);

        const formatted = otherUsers.map((u) => ({
          matchId: u._id,
          uuid: u.uuid,
          name: u.name,
          location: u.location,
          profilePicture: u.profilePicture || '',
        }));

        setMatches(formatted);
      } catch (error) {
        console.error('Error al obtener matches:', error);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div>
      <h2>Tus matches</h2>
      {matches.length === 0 ? (
        <p>Aún no tienes matches.</p>
      ) : (
        <ul>
          {matches.map((match) => (
            <li key={match.matchId}>
              <img
                src={match.profilePicture || 'https://via.placeholder.com/50'}
                alt={match.name}
                width={50}
              />
              <strong>{match.name}</strong> - {match.location}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Matches;
