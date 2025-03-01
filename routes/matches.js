// routes/matches.js

/**
 * Importación de módulos necesarios
 */
const express = require('express'); // Framework Express.js
const { getMatches } = require('../controllers/matches'); // Importación del controlador de matches

// Creación del enrutador de Express
const router = express.Router();

/**
 * @route   GET /api/matches
 * @desc    Obtiene la lista de matches entre usuarios que se han dado "like" mutuamente.
 * @access  Público
 * @returns { matches: [{ user1: number, user2: number }] }
 *          - `user1`: ID del primer usuario en el match.
 *          - `user2`: ID del segundo usuario en el match.
 */
router.get('/', getMatches);

// Exportación del enrutador para su uso en index.js
module.exports = router;
