// routes/messages.js
// Importa Express para definir rutas
const express = require('express');
// Crea una instancia del enrutador
const router = express.Router();

// Importa el controlador que obtiene los mensajes entre dos usuarios
const { getMessages } = require('../controllers/messages');

// Ruta GET para obtener todos los mensajes entre dos usuarios específicos
// Endpoint: /api/messages/:user1Id/:user2Id
// Se usa para cargar el historial de conversación entre dos usuarios
router.get('/:user1Id/:user2Id', getMessages);

// Exporta el enrutador para ser utilizado en el servidor principal
module.exports = router;
