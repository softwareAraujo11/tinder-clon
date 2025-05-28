// components/Chat.js
import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { auth } from '../services/firebase';
import { useParams } from 'react-router-dom';

const socket = io('http://localhost:3000');

const Chat = () => {
  const { userUuid: receiverUuid } = useParams();
  const [senderUuid, setSenderUuid] = useState(null);
  const [senderName, setSenderName] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const currentUser = auth.currentUser;
      const res = await fetch('http://localhost:3000/api/users');
      const users = await res.json();

      const mongoSender = users.find((u) => u.email === currentUser.email);
      const mongoReceiver = users.find((u) => u.uuid === receiverUuid);

      if (mongoSender) {
        setSenderUuid(mongoSender.uuid);
        setSenderName(mongoSender.name || 'Tú');
      }

      if (mongoReceiver) {
        setReceiverName(mongoReceiver.name || 'Ell@');
      }
    };

    fetchUsers();
  }, [receiverUuid]);

  useEffect(() => {
    if (senderUuid && receiverUuid) {
      socket.emit('join_room', { userUuid1: senderUuid, userUuid2: receiverUuid });
    }
  }, [senderUuid, receiverUuid]);

  useEffect(() => {
    socket.on('receive_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    return () => socket.off('receive_message');
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (senderUuid && receiverUuid) {
        const res = await fetch(`http://localhost:3000/api/messages/${senderUuid}/${receiverUuid}`);
        const data = await res.json();
        setMessages(data);
        scrollToBottom();
      }
    };

    fetchMessages();
  }, [senderUuid, receiverUuid]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      senderUuid,
      receiverUuid,
      content: message.trim(),
    };

    socket.emit('sendMessage', msgData);
    setMessages((prev) => [...prev, { ...msgData, _id: Date.now() }]);
    setMessage('');
    scrollToBottom();
  };

  return (
    <div>
      <h2>Chat con {receiverName}</h2>
      <div style={{ minHeight: '300px', border: '1px solid #ccc', padding: '10px', marginBottom: '10px', overflowY: 'auto' }}>
        {messages.map((msg, idx) => (
          <div key={msg._id || idx} style={{ textAlign: msg.senderUuid === senderUuid ? 'right' : 'left' }}>
            <strong>{msg.senderUuid === senderUuid ? senderName : receiverName}:</strong> {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe un mensaje..."
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
};

export default Chat;
