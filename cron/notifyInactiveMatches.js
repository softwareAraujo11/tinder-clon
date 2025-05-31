// cron/notifyInactiveMatches.js
const Match = require('../models/Match');
const Message = require('../models/Message');
const User = require('../models/User');

const INACTIVITY_THRESHOLD_MINUTES = 30;

const notifyInactiveMatches = (io) => {
  const checkInactiveMatches = async () => {
    try {
      const matches = await Match.find({});
      const thresholdTime = new Date(Date.now() - INACTIVITY_THRESHOLD_MINUTES * 60 * 1000);

      for (const match of matches) {
        const { user1Uuid, user2Uuid } = match;

        const lastMessage = await Message.findOne({
          $or: [
            { senderUuid: user1Uuid, receiverUuid: user2Uuid },
            { senderUuid: user2Uuid, receiverUuid: user1Uuid }
          ]
        }).sort({ timestamp: -1 });

        if (!lastMessage || new Date(lastMessage.timestamp) < thresholdTime) {
          const otherUser = await User.findOne({ uuid: user2Uuid });
          if (otherUser) {
            io.emit('match:inactiveReminder', { name: otherUser.name });
          }
        }
      }
    } catch (error) {
      console.error('Error en el cron job de notificaciones:', error);
    }
  };
  setInterval(checkInactiveMatches, INACTIVITY_THRESHOLD_MINUTES * 60 * 1000);
};

module.exports = notifyInactiveMatches;
