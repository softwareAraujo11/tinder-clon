// routes/messages.js

const express = require('express');
const router = express.Router();
const { getMessages } = require('../controllers/messages');

router.get('/:user1Id/:user2Id', getMessages);

module.exports = router;