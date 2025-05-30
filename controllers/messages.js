// controllers/messages.js
const Message = require('../models/Message');
const User = require('../models/User');

const getMessages = async (req, res) => {
  const { userUuid1, userUuid2 } = req.params;

  try {
    if (!userUuid1 || !userUuid2) {
      return res.status(400).json({ error: 'Faltan UUIDs de usuarios.' });
    }

    const messages = await Message.find({
      $or: [
        { senderUuid: userUuid1, receiverUuid: userUuid2 },
        { senderUuid: userUuid2, receiverUuid: userUuid1 }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
};

const getUserConversations = async (req, res) => {
  const { userUuid } = req.params;

  try {
    if (!userUuid) {
      return res.status(400).json({ error: 'Falta el UUID del usuario.' });
    }

    const messages = await Message.find({
      $or: [{ senderUuid: userUuid }, { receiverUuid: userUuid }]
    });

    const uuids = new Set();
    messages.forEach((msg) => {
      if (msg.senderUuid !== userUuid) uuids.add(msg.senderUuid);
      if (msg.receiverUuid !== userUuid) uuids.add(msg.receiverUuid);
    });

    const users = await User.find({ uuid: { $in: [...uuids] } });

    res.status(200).json(users.map(u => ({
      uuid: u.uuid,
      name: u.name,
      location: u.location,
      profilePicture: u.profilePicture || ''
    })));
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener conversaciones' });
  }
};

module.exports = {
  getMessages,
  getUserConversations
};