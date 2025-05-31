// routes/swipes.js
const express = require('express');
const router = express.Router();
const { registerSwipe, removeSwipe } = require('../controllers/swipes');

router.post('/', registerSwipe);
router.delete('/', removeSwipe);

module.exports = router;
