// index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/database');
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const swipesRoutes = require('./routes/swipes');
const matchesRoutes = require('./routes/matches');
const messagesRoutes = require('./routes/messages');
const Message = require('./models/Message');
const User = require('./models/User');
const Match = require('./models/Match');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
const PORT = 3000;

connectDB();
app.use(express.json());

app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/swipes', swipesRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/messages', messagesRoutes);

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('sendMessage', async (data) => {
    try {
      const { senderId, receiverId, content } = data;

      // 1. Verificar si hay un match (usando tus modelos)
      const isMatch = await Match.findOne({
        $or: [
          { user1Id: senderId, user2Id: receiverId },
          { user1Id: receiverId, user2Id: senderId },
        ],
      });

      if (!isMatch) {
        console.log('No match found. Message not sent.');
        socket.emit('message_error', { message: 'No match found. Cannot send message.' });
        return;
      }

      const sender = await User.findOne({ id: senderId });
      if (!sender) {
        console.error('Sender not found.');
        return;
      }

      const newMessage = new Message({
        senderId: senderId,
        receiverId: receiverId,
        content: content,
        timestamp: new Date(),
      });
      await newMessage.save();

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

  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log('Express.js App is running at port: ' + PORT);
});