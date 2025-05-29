// routes/matches.js
const express = require('express');
const router = express.Router();
const { getMatches, getMatchByUsers } = require('../controllers/matches');

router.get('/', getMatches);
router.get('/:userUuid1/:userUuid2', getMatchByUsers);

module.exports = router;
