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

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
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
      const newMessage = new Message({
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: data.content
      });
      await newMessage.save();
      io.sockets.emit('receive_message', data);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log("Express.js App is running at port: " + PORT);
});
