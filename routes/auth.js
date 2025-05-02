// routes/auth.js
// Importa Express para definir rutas
const express = require('express');
// Importa el controlador que maneja el inicio de sesión
const { loginUser } = require('../controllers/auth');

// Crea un enrutador de Express
const router = express.Router();

// Ruta POST para iniciar sesión de un usuario
// Endpoint: /api/auth/login
router.post('/login', loginUser);

// Exporta el enrutador para ser usado en el archivo principal (index.js)
module.exports = router;
