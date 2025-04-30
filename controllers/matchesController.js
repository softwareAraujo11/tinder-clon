// controllers/matchesController.js
const Match = require('../models/Match');
const User = require('../models/User'); // Asegúrate de tener tu modelo User

exports.getUserMatches = async (req, res) => {
    try {
        const userId = req.userId; // Obtener el ID del usuario autenticado del middleware

        // Buscar todos los matches donde el usuario actual es user1 o user2
        const matches = await Match.find({
            $or: [
                { user1Id: userId },
                { user2Id: userId }
            ]
        });

        const matchedUserIds = [];
        matches.forEach(match => {
            if (match.user1Id !== userId) {
                matchedUserIds.push(match.user1Id);
            } else if (match.user2Id !== userId) {
                matchedUserIds.push(match.user2Id);
            }
        });

        // Obtener la información de los usuarios con los que se hizo match
        const matchedUsers = await User.find({ _id: { $in: matchedUserIds } }).select('name imageUrl'); // Ajusta los campos que quieras obtener

        res.status(200).json(matchedUsers);
    } catch (error) {
        console.error('Error al obtener los matches del usuario:', error);
        res.status(500).json({ message: 'Error al obtener los matches del usuario' });
    }
};