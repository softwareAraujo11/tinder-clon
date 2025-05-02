// routes/swipes.js
// Importa Express para la definición de rutas
const express = require('express');
// Importa el controlador que maneja las acciones de swipe (like/dislike)
const { swipeUser } = require('../controllers/swipes');

// Crea una instancia del enrutador de Express
const router = express.Router();

// Ruta POST para registrar un swipe (like o dislike) entre usuarios
// Endpoint: /api/swipes
router.post('/', swipeUser);

// Exporta el enrutador para ser utilizado en la configuración principal del servidor
module.exports = router;
