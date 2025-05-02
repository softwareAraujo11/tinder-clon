// routes/users.js
// Importa Express para definir rutas HTTP
const express = require('express');
// Importa los controladores de usuarios: obtener y registrar
const { getUsers, registerUser } = require('../controllers/users');

// Crea una instancia del enrutador de Express
const router = express.Router();

// Ruta GET para obtener todos los usuarios registrados
// Endpoint: /api/users
router.get('/', getUsers);

// Ruta POST para registrar un nuevo usuario en la base de datos
// Endpoint: /api/users
router.post('/', registerUser);

// Exporta el enrutador para que sea usado en el archivo principal del servidor
module.exports = router;
