// routes/matches.js
const express = require('express');
const router = express.Router();
const { getMatches, getMatchByUsers } = require('../controllers/matches');

// Obtener todos los matches de un usuario por UUID
router.get('/', getMatches); // Ejemplo: /api/matches?userUuid=...

// Verificar si hay match entre dos usuarios por UUID
router.get('/:userUuid1/:userUuid2', getMatchByUsers);

module.exports = router;
