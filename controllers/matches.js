// controllers/matches.js
const { matches } = require('./swipes');

const getMatches = (req, res) => {
    res.json({ matches });
};

module.exports = { getMatches };