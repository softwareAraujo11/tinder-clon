// routes/matches.js
const express = require('express');
const { getMatches } = require('../controllers/matches');
const router = express.Router();

router.get('/', getMatches); // Obtener lista de matches

module.exports = router;