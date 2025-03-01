// controllers/swipes.js
const swipes = [];
const matches = [];

const swipeUser = (req, res) => {
    const { userId, targetUserId, action } = req.body;
    if (action !== 'like' && action !== 'dislike') {
        return res.status(400).json({ message: 'Invalid action' });
    }
    swipes.push({ userId, targetUserId, action });

    // Verificar si hay match
    const isMatch = swipes.some(swipe => 
        swipe.userId === targetUserId && 
        swipe.targetUserId === userId && 
        swipe.action === 'like'
    );

    if (isMatch) {
        matches.push({ user1: userId, user2: targetUserId });
        return res.json({ message: 'Swipe registered', match: true });
    }

    res.json({ message: 'Swipe registered', match: false });
};

module.exports = { swipeUser, matches };