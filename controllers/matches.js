// controllers/matches.js

/**
 * Importación del módulo de swipes, donde se almacenan los matches en memoria.
 */
const { matches } = require('./swipes');

/**
 * @function getMatches
 * @desc    Obtiene la lista de matches entre usuarios que se han dado "like" mutuamente.
 * @route   GET /api/matches
 * @access  Público
 * @returns {Object} Lista de matches en formato JSON.
 *          - `matches`: Array de objetos con los usuarios emparejados.
 *              - `user1`: ID del primer usuario del match.
 *              - `user2`: ID del segundo usuario del match.
 */
const getMatches = (req, res) => {
    res.json({ matches });
};

// Exportación de la función para su uso en el router
module.exports = { getMatches };
