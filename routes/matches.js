// routes/matches.js
const express = require('express');
const router = express.Router();
const { getMatches, getMatchByUsers, deleteMatch } = require('../controllers/matches');

router.get('/', getMatches);
router.get('/:userUuid1/:userUuid2', getMatchByUsers);
router.delete('/', deleteMatch);

module.exports = router;
