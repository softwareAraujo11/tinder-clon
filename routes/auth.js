// routes/auth.js

/**
 * Importación de módulos necesarios
 */
const express = require('express'); // Framework Express.js
const { loginUser } = require('../controllers/auth'); // Importación del controlador de autenticación

// Creación del enrutador de Express
const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Autentica a un usuario con su email y contraseña.
 * @access  Público
 * @body    { email: string, password: string }
 *          - `email`: Correo electrónico del usuario.
 *          - `password`: Contraseña del usuario.
 * @returns { message: string, user?: object }
 *          - `message`: Indica si la autenticación fue exitosa o fallida.
 *          - `user` (opcional): Datos del usuario autenticado si el login es correcto.
 */
router.post('/login', loginUser);

// Exportación del enrutador para su uso en index.js
module.exports = router;
