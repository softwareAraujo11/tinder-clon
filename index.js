// index.js
const express = require('express');
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const swipesRoutes = require('./routes/swipes');
const matchesRoutes = require('./routes/matches');

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware para procesar JSON

// Rutas
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/swipes', swipesRoutes);
app.use('/api/matches', matchesRoutes);

app.listen(PORT, () => {
    console.log("Express.js App is running at port: " + PORT);
});