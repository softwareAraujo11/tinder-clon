// components/SuggestedUsers.js
import React, { useEffect, useState } from 'react';
import { auth } from '../services/firebase';

const SuggestedUsers = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [currentUserUuid, setCurrentUserUuid] = useState(null);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const resUsers = await fetch('http://localhost:3000/api/users');
      const users = await resUsers.json();
      const mongoUser = users.find((u) => u.email === currentUser.email);
      if (!mongoUser) return;

      setCurrentUserUuid(mongoUser.uuid);

      const res = await fetch(`http://localhost:3000/api/users/suggested/${mongoUser.uuid}`);
      const data = await res.json();
      setSuggestedUsers(data);
    };

    fetchSuggestedUsers();
  }, []);

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

      const data = await res.json();

      setSuggestedUsers((prev) => prev.filter((user) => user.uuid !== targetUuid));
    } catch (error) {}
  };

  return (
    <div>
      <h2>Usuarios sugeridos</h2>
      {suggestedUsers.length === 0 ? (
        <p>No hay más sugerencias por ahora.</p>
      ) : (
        <ul>
          {suggestedUsers.map((user) => (
            <li key={user.uuid}>
              <img src={user.profilePicture} alt={user.name} />
              <strong>{user.name}</strong> - {user.location}
              <br />
              <button onClick={() => handleLike(user.uuid)}>❤️ Me gusta</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SuggestedUsers;
