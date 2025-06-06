// components/Chat.js
import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { auth } from '../services/firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Chat.css';

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

      try {
        const resUsers = await fetch('http://localhost:3000/api/users');
        const users = await resUsers.json();

        const current = users.find((u) => u.email === firebaseUser.email);
        const other = users.find((u) => u.uuid === userUuid);

        if (!current || !other) {
          toast.error('Error: usuarios no encontrados');
          return;
        }

        setCurrentUser(current);
        setReceiver(other);

        const res = await fetch(`http://localhost:3000/api/messages/${current.uuid}/${other.uuid}`);
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        toast.error('Error al cargar el chat');
        console.error('Error al cargar chat:', error);
      }
    };

    fetchData();
  }, [userUuid]);

  useEffect(() => {
    if (currentUser && receiver) {
      const roomId = [currentUser.uuid, receiver.uuid].sort().join('_');
      socket.emit('joinRoom', roomId);
    }
  }, [currentUser, receiver]);

  useEffect(() => {
    const handleReceive = (message) => {
      setMessages((prev) => [...prev, message]);
      if (message.senderUuid !== currentUser?.uuid) {
        toast.info(`Nuevo mensaje de ${receiver?.name}`);
      }
    };

    socket.on('receive_message', handleReceive);
    socket.on('disconnect', () => {
      toast.warn('Conexión perdida con el servidor');
    });

    return () => {
      socket.off('receive_message', handleReceive);
      socket.off('disconnect');
    };
  }, [currentUser, receiver]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !currentUser || !receiver) return;

    try {
      socket.emit('sendMessage', {
        senderUuid: currentUser.uuid,
        receiverUuid: receiver.uuid,
        content: newMessage.trim(),
      });

      setNewMessage('');
      toast.success('Mensaje enviado');
    } catch (err) {
      toast.error('No se pudo enviar el mensaje');
    }
  };

  if (!currentUser || !receiver) return <p>Cargando chat...</p>;

  return (
    <div className="chat-wrapper">
      <div className="chat-header">Chat con {receiver.name}</div>
      <div className="chat-body">
        {messages.map((msg, i) => {
          const isSender = msg.senderUuid === currentUser.uuid;
          const senderName = isSender ? 'Tú' : receiver.name;
          const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <div key={msg._id || i} className={`message-row ${isSender ? 'sent' : 'received'}`}>
              <div className="message-box">
                <div className="message-header">
                  <span className="sender-name">{senderName}</span>
                  <span className="timestamp">{time}</span>
                </div>
                <div className="message-text">{msg.content}</div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div className="chat-input-area">
        <input
          type="text"
          className="chat-input"
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSend} className="chat-send-button">Enviar</button>
      </div>
    </div>
  );
};

export default Chat;
