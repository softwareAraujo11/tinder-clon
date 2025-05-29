// components/Matches.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';

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

export default Matches;
