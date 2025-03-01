// routes/swipes.js
const express = require('express');
const { swipeUser } = require('../controllers/swipes');
const router = express.Router();

router.post('/', swipeUser); // Like o dislike a un usuario

module.exports = router;