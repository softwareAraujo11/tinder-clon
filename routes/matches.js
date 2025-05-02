// routes/matches.js
// Importa Express para crear rutas HTTP
const express = require('express');
// Importa el controlador que obtiene los matches entre usuarios
const { getMatches } = require('../controllers/matches');

// Crea una instancia del enrutador de Express
const router = express.Router();

// Ruta GET para obtener todos los matches registrados
// Endpoint: /api/matches
router.get('/', getMatches);

// Exporta el enrutador para su uso en el archivo principal del servidor
module.exports = router;
