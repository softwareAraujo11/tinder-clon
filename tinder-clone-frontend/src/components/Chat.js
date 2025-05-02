// // index.js
// Importa React y hooks para manejar estado y efectos
import React, { useState, useEffect, useRef } from 'react';
// Importa la librería de Socket.io cliente
import io from 'socket.io-client';
// Importa los estilos CSS del componente
import '../styles/Chat.css';

// Componente funcional Chat
const Chat = () => {
  // Estados para manejar los datos del mensaje
  const [senderId, setSenderId] = useState('');       // ID del remitente
  const [receiverId, setReceiverId] = useState('');   // ID del receptor
  const [message, setMessage] = useState('');         // Contenido del mensaje
  const [messages, setMessages] = useState([]);       // Historial de mensajes
  const socketRef = useRef();                         // Referencia al socket
  const [error, setError] = useState('');             // Mensajes de error

  // Efecto que se ejecuta al montar el componente
  useEffect(() => {
    // Conexión al servidor backend vía WebSocket
    socketRef.current = io('http://localhost:3000');

    // Escucha de mensajes entrantes
    socketRef.current.on('receive_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Manejo de errores enviados desde el servidor
    socketRef.current.on('message_error', (data) => {
      setError(data.message);
      setTimeout(() => setError(''), 3000); // Borra el error después de 3 segundos
    });

    // Limpieza al desmontar el componente
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Función que envía el mensaje por el socket
  const sendMessage = () => {
    if (message && senderId && receiverId) {
      socketRef.current.emit('sendMessage', {
        senderId: senderId,
        receiverId: receiverId,
        content: message,
      });
      setMessage(''); // Limpia el campo de mensaje después de enviarlo
    }
  };

  // Estructura visual del componente
  return (
    <div className="chat-container">
      
      {/* Sección para ingresar el ID del remitente */}
      <div className="input-section">
        <label>Sender ID:</label>
        <input
          type="text"
          value={senderId}
          onChange={(e) => setSenderId(e.target.value)}
        />
      </div>

      {/* Sección para ingresar el ID del receptor */}
      <div className="input-section">
        <label>Receiver ID:</label>
        <input
          type="text"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
        />
      </div>

      {/* Campo de entrada del mensaje y botón para enviar */}
      <div className="input-section">
        <label>Message:</label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      {/* Muestra mensajes de error, si existen */}
      {error && <div className="error-message">{error}</div>}

      {/* Muestra el historial de mensajes */}
      <div className="message-container">
        <h3>Chat:</h3>
        {messages.map((msg, index) => {
          const sender = msg.senderName ? msg.senderName : msg.senderId;
          return (
            <div key={index} className="message">
              <strong className="sender-name">{sender}:</strong>
              <span className="message-content">{msg.content}</span>
              <span className="timestamp">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Exporta el componente para ser utilizado en App.js
export default Chat;
