// routes/swipes.js

/**
 * Importación de módulos necesarios
 */
const express = require('express'); // Framework Express.js
const { swipeUser } = require('../controllers/swipes'); // Importación del controlador de swipes

// Creación del enrutador de Express
const router = express.Router();

/**
 * @route   POST /api/swipes
 * @desc    Registra un "like" o "dislike" a un usuario.
 * @access  Público
 * @body    { userId: number, targetUserId: number, action: string }
 *          - `userId`: ID del usuario que hace el swipe.
 *          - `targetUserId`: ID del usuario al que se le aplica el swipe.
 *          - `action`: "like" o "dislike" (determina si hay interés o no).
 */
router.post('/', swipeUser);

// Exportación del enrutador para su uso en index.js
module.exports = router;
