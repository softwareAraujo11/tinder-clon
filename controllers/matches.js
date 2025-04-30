// controllers/matches.js

const Match = require('../models/Match');
const User = require('../models/User');

const getMatches = async (req, res) => {
  try {
    const matches = await Match.find()
      .populate({ path: 'user1Id', select: '-password', foreignField: 'id', localField: 'user1Id' })
      .populate({ path: 'user2Id', select: '-password', foreignField: 'id', localField: 'user2Id' });
    res.json({ matches });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMatches };
