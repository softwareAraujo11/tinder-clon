// routes/users.js

/**
 * Importación de módulos necesarios
 */
const express = require('express'); // Framework Express.js
const { getUsers, registerUser } = require('../controllers/users'); // Importación de controladores de usuario

// Creación del enrutador de Express
const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Obtiene la lista de usuarios registrados en el sistema.
 * @access  Público
 */
router.get('/', getUsers);

/**
 * @route   POST /api/users
 * @desc    Registra un nuevo usuario en el sistema.
 * @access  Público
 */
router.post('/', registerUser);

// Exportación del enrutador para su uso en index.js
module.exports = router;
