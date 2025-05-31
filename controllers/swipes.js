// controllers/swipes.js
const Swipe = require('../models/Swipe');
const Match = require('../models/Match');

const registerSwipe = async (req, res) => {
  try {
    const { originUserUuid, targetUserUuid, action } = req.body;

    if (!originUserUuid || !targetUserUuid || !action) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const existingSwipe = await Swipe.findOne({ originUserUuid, targetUserUuid });
    if (existingSwipe) {
      return res.status(409).json({ error: 'Ya hiciste swipe a este usuario' });
    }

    const swipe = new Swipe({ originUserUuid, targetUserUuid, action });
    await swipe.save();

    if (action === 'like') {
      const mutual = await Swipe.findOne({
        originUserUuid: targetUserUuid,
        targetUserUuid: originUserUuid,
        action: 'like'
      });

      if (mutual) {
        const match = new Match({
          user1Uuid: originUserUuid,
          user2Uuid: targetUserUuid,
          timestamp: new Date()
        });
        await match.save();
        return res.status(201).json({ message: '¡Es un match!', match });
      }
    }

    res.status(201).json({ message: 'Swipe registrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const removeSwipe = async (req, res) => {
  try {
    const { originUserUuid, targetUserUuid } = req.body;

    if (!originUserUuid || !targetUserUuid) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    await Swipe.deleteOne({ originUserUuid, targetUserUuid, action: 'like' });

    res.status(200).json({ message: 'Like eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el like' });
  }
};

module.exports = { registerSwipe, removeSwipe };