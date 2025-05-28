// routes/swipes.js
const express = require('express');
const router = express.Router();
const { registerSwipe } = require('../controllers/swipes');

router.post('/', registerSwipe);

module.exports = router;
