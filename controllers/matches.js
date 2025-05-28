// controllers/matches.js
const Match = require('../models/Match');
const User = require('../models/User');

// Obtener todos los matches de un usuario por UUID
const getMatches = async (req, res) => {
  try {
    const { userUuid } = req.query;

    if (!userUuid) {
      return res.status(400).json({ error: 'Falta el parámetro userUuid' });
    }

    const matches = await Match.find({
      $or: [{ user1Uuid: userUuid }, { user2Uuid: userUuid }]
    });

    const userUuids = matches.map(m => (m.user1Uuid === userUuid ? m.user2Uuid : m.user1Uuid));
    const matchedUsers = await User.find({ uuid: { $in: userUuids } });

    res.json(matchedUsers);
  } catch (error) {
    console.error('Error al obtener matches:', error);
    res.status(500).json({ error: 'Error al obtener matches' });
  }
};

// Verificar si hay un match entre dos usuarios
const getMatchByUsers = async (req, res) => {
  const { userUuid1, userUuid2 } = req.params;

  try {
    const match = await Match.findOne({
      $or: [
        { user1Uuid: userUuid1, user2Uuid: userUuid2 },
        { user1Uuid: userUuid2, user2Uuid: userUuid1 }
      ]
    });

    if (match) {
      res.json({ match });
    } else {
      res.status(404).json({ message: 'No hay match entre estos usuarios' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el match' });
  }
};

module.exports = {
  getMatches,
  getMatchByUsers
};
