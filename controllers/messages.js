// controllers/messages.js
const Message = require('../models/Message');

const createMessage = async (req, res) => {
  try {
    const { senderUuid, receiverUuid, content } = req.body;
    const message = new Message({ senderUuid, receiverUuid, content });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error('Error al crear mensaje:', error);
    res.status(500).json({ error: 'Error al crear el mensaje' });
  }
};

const getMessagesBetweenUsers = async (req, res) => {
  try {
    const { senderUuid, receiverUuid } = req.params;
    const messages = await Message.find({
      $or: [
        { senderUuid, receiverUuid },
        { senderUuid: receiverUuid, receiverUuid: senderUuid }
      ]
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ error: 'Error al obtener los mensajes' });
  }
};

module.exports = {
  createMessage,
  getMessagesBetweenUsers
};
