// controllers/swipes.js
const Swipe = require('../models/Swipe');
const Match = require('../models/Match');
const User = require('../models/User');

const swipeUser = async (req, res) => {
  const { userId, targetUserId, action } = req.body;

  if (action !== 'like' && action !== 'dislike') {
    return res.status(400).json({ message: 'Invalid action' });
  }

  try {
    const originUser = await User.findOne({ id: userId });
    const targetUser = await User.findOne({ id: targetUserId });

    if (!originUser || !targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newSwipe = new Swipe({ originUserId: userId, targetUserId, action });
    await newSwipe.save();

    const existingSwipe = await Swipe.findOne({
      originUserId: targetUserId,
      targetUserId: userId,
      action: 'like'
    });

    if (existingSwipe && action === 'like') {
      const newMatch = new Match({ user1Id: userId, user2Id: targetUserId });
      await newMatch.save();
      return res.json({ message: 'Swipe registered', match: true });
    }

    res.json({ message: 'Swipe registered', match: false });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { swipeUser };
