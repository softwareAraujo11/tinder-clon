// routes/messages.js
const express = require('express');
const router = express.Router();
const { getMessages, getUserConversations } = require('../controllers/messages');

router.get('/conversations/:userUuid', getUserConversations);
router.get('/:userUuid1/:userUuid2', getMessages);

module.exports = router;
