// index.js
// Importación de módulos esenciales
const express = require('express'); // Framework para crear el servidor web
const http = require('http'); // Módulo nativo para crear servidor HTTP
const { Server } = require('socket.io'); // Socket.io para comunicación en tiempo real

// Conexión a la base de datos
const connectDB = require('./config/database');

// Importación de rutas
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const swipesRoutes = require('./routes/swipes');
const matchesRoutes = require('./routes/matches');
const messagesRoutes = require('./routes/messages');

// Importación de modelos
const Message = require('./models/Message');
const User = require('./models/User');
const Match = require('./models/Match');

// Inicialización de la aplicación Express
const app = express();
const server = http.createServer(app); // Se crea un servidor HTTP basado en Express

// Configuración del servidor de WebSockets
const io = new Server(server, {
  cors: {
    origin: '*', // Permite peticiones desde cualquier origen
    methods: ['GET', 'POST'], // Métodos permitidos
  },
});

// Puerto donde se ejecutará el servidor
const PORT = 3000;

// Conexión a la base de datos MongoDB
connectDB();

// Middleware para parsear solicitudes con JSON
app.use(express.json());

// Rutas para la API REST
app.use('/api/users', usersRoutes);       // Registro y obtención de usuarios
app.use('/api/auth', authRoutes);         // Autenticación de usuarios
app.use('/api/swipes', swipesRoutes);     // Likes/Dislikes entre usuarios
app.use('/api/matches', matchesRoutes);   // Listado de matches
app.use('/api/messages', messagesRoutes); // Obtener historial de mensajes

// Manejo de conexión de sockets
io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`); // Notifica nueva conexión

  // Evento para enviar mensaje
  socket.on('sendMessage', async (data) => {
    try {
      const { senderId, receiverId, content } = data;

      // Verifica si existe un match entre ambos usuarios
      const isMatch = await Match.findOne({
        $or: [
          { user1Id: senderId, user2Id: receiverId },
          { user1Id: receiverId, user2Id: senderId },
        ],
      });

      // Si no hay match, se rechaza el envío
      if (!isMatch) {
        console.log('No match found. Message not sent.');
        socket.emit('message_error', { message: 'No match found. Cannot send message.' });
        return;
      }

      // Verifica que el remitente exista
      const sender = await User.findOne({ id: senderId });
      if (!sender) {
        console.error('Sender not found.');
        return;
      }

      // Guarda el nuevo mensaje en la base de datos
      const newMessage = new Message({
        senderId: senderId,
        receiverId: receiverId,
        content: content,
        timestamp: new Date(),
      });
      await newMessage.save();

      // Emite el mensaje a todos los sockets conectados
      io.sockets.emit('receive_message', {
        senderId: senderId,
        senderName: sender.name,
        receiverId: receiverId,
        content: content,
        timestamp: newMessage.timestamp,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message_error', { message: 'Error sending message.' });
    }
  });

  // Evento de desconexión
  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

// Inicia el servidor
server.listen(PORT, () => {
  console.log('Express.js App is running at port: ' + PORT);
});
