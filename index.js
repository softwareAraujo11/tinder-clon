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

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
}));
app.use(express.json());

app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/swipes', swipesRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/messages', messagesRoutes);

io.on('connection', (socket) => {
});

server.listen(PORT, () => {
  console.log('Express.js App is running at port: ' + PORT);
});
