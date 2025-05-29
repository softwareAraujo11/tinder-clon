// index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/database');

const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const swipesRoutes = require('./routes/swipes');
const matchesRoutes = require('./routes/matches');
const messagesRoutes = require('./routes/messages');

const socketHandler = require('./socket');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = 3000;

connectDB();

const allowedOrigins = ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/swipes', swipesRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/messages', messagesRoutes);

socketHandler(io);

server.listen(PORT);
