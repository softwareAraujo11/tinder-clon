// routes/messages.js
const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessagesBetweenUsers
} = require('../controllers/messages'); // Asegúrate que la ruta sea correcta

router.post('/', createMessage); // ✅ esta línea estaba fallando por "undefined"
router.get('/:senderUuid/:receiverUuid', getMessagesBetweenUsers);

module.exports = router;
