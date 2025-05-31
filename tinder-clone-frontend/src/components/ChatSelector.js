// components/ChatSelector.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/ChatSelector.css';

const ChatSelector = () => {
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) return;

      try {
        const resUser = await fetch(`http://localhost:3000/api/users/email/${firebaseUser.email}`);
        const mongoUser = await resUser.json();

        if (!mongoUser || !mongoUser.uuid) {
          toast.error('No se encontró el usuario autenticado.');
          return;
        }

        const resMessages = await fetch(`http://localhost:3000/api/messages/conversations/${mongoUser.uuid}`);
        const conversations = await resMessages.json();

        if (!conversations.length) {
          toast.info('No has iniciado conversaciones aún.');
        }

        const formatted = conversations.map((contact) => ({
          uuid: contact.uuid,
          name: contact.name,
          location: contact.location,
          profilePicture: contact.profilePicture?.trim()
            ? contact.profilePicture
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=ff5864&color=fff&size=128`,
        }));

        setContacts(formatted);
      } catch (error) {
        console.error('Error al cargar contactos del chat:', error);
        toast.error('No se pudieron cargar los contactos del chat.');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="chat-selector-container">
      <h2 className="chat-selector-title">Chats iniciados</h2>
      {contacts.length === 0 ? (
        <p className="no-chats">No has iniciado conversaciones.</p>
      ) : (
        <div className="chat-grid">
          {contacts.map((contact) => (
            <div key={contact.uuid} className="chat-card">
              <img
                src={contact.profilePicture}
                alt={contact.name}
                className="chat-img"
                onError={(e) => { e.target.src = '/default-avatar.png'; }}
              />
              <div className="chat-info">
                <h4>{contact.name}</h4>
                <p>{contact.location}</p>
              </div>
              <button onClick={() => navigate(`/chat/${contact.uuid}`)} className="chat-button">
                Continuar Chat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatSelector;
