// controllers/messages.js

const Message = require('../models/Message');

const getMessages = async (req, res) => {
    try {
        const { user1Id, user2Id } = req.params;
        const messages = await Message.find({
            $or: [
                { senderId: user1Id, receiverId: user2Id },
                { senderId: user2Id, receiverId: user1Id }
            ]
        }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMessages };