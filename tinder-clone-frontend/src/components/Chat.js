// components/Chat.js
import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { auth } from '../services/firebase';

const socket = io('http://localhost:3000');

const Chat = () => {
  const { userUuid } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return;

      const resUsers = await fetch('http://localhost:3000/api/users');
      const users = await resUsers.json();
      const current = users.find((u) => u.email === firebaseUser.email);
      const other = users.find((u) => u.uuid === userUuid);

      if (!current || !other) return;

      setCurrentUser(current);
      setReceiver(other);

      const res = await fetch(`http://localhost:3000/api/messages/${current.uuid}/${other.uuid}`);
      const data = await res.json();

      setMessages(data);

      const roomId = [current.uuid, other.uuid].sort().join('_');
      socket.emit('joinRoom', roomId);
    };

    fetchData();
  }, [userUuid]);

  useEffect(() => {
    socket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !currentUser || !receiver) return;

    socket.emit('sendMessage', {
      senderUuid: currentUser.uuid,
      receiverUuid: receiver.uuid,
      content: newMessage.trim(),
    });

    setNewMessage('');
  };

  if (!currentUser || !receiver) return <p>Cargando chat...</p>;

  return (
    <div>
      <h2>Chat con {receiver.name}</h2>
      <div>
        {messages.map((msg, i) =>
          msg && msg.senderUuid && msg.content ? (
            <div key={msg._id || i}>
              <strong>{msg.senderUuid === currentUser.uuid ? 'Tú' : receiver.name}:</strong> {msg.content}
            </div>
          ) : null
        )}
        <div ref={bottomRef} />
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Escribe tu mensaje..."
      />
      <button onClick={handleSend}>Enviar</button>
    </div>
  );
};

export default Chat;
