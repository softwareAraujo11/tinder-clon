// components/ChatSelector.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';

const ChatSelector = () => {
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) return;

      try {
        const resUser = await fetch(`http://localhost:3000/api/users/email/${firebaseUser.email}`);
        const mongoUser = await resUser.json();

        if (!mongoUser || !mongoUser.uuid) return;

        const resMessages = await fetch(`http://localhost:3000/api/messages/conversations/${mongoUser.uuid}`);
        const conversations = await resMessages.json();

        const formatted = conversations.map((contact) => ({
          uuid: contact.uuid,
          name: contact.name,
          location: contact.location,
          profilePicture: contact.profilePicture || '',
        }));

        setContacts(formatted);
      } catch (error) {}
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>Chats iniciados</h2>
      {contacts.length === 0 ? (
        <p>No has iniciado conversaciones.</p>
      ) : (
        <ul>
          {contacts.map((contact) => (
            <li key={contact.uuid}>
              <img src={contact.profilePicture} alt={contact.name} />
              <strong>{contact.name}</strong> - {contact.location}
              <br />
              <button onClick={() => navigate(`/chat/${contact.uuid}`)}>Continuar Chat</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatSelector;
