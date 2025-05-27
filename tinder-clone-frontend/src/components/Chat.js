// // index.js
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import '../styles/Chat.css';

const Chat = () => {
  const [senderId, setSenderId] = useState('');    
  const [receiverId, setReceiverId] = useState('');
  const [message, setMessage] = useState('');      
  const [messages, setMessages] = useState([]);    
  const socketRef = useRef();                       
  const [error, setError] = useState('');         

  
  useEffect(() => {
    socketRef.current = io('http://localhost:3000');

    socketRef.current.on('receive_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socketRef.current.on('message_error', (data) => {
      setError(data.message);
      setTimeout(() => setError(''), 3000); 
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message && senderId && receiverId) {
      socketRef.current.emit('sendMessage', {
        senderId: senderId,
        receiverId: receiverId,
        content: message,
      });
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      
      {}
      <div className="input-section">
        <label>Sender ID:</label>
        <input
          type="text"
          value={senderId}
          onChange={(e) => setSenderId(e.target.value)}
        />
      </div>

      {}
      <div className="input-section">
        <label>Receiver ID:</label>
        <input
          type="text"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
        />
      </div>

      {}
      <div className="input-section">
        <label>Message:</label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      {}
      {error && <div className="error-message">{error}</div>}

      {}
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

export default Chat;
