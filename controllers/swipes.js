// controllers/swipes.js

/**
 * Almacenamiento temporal de swipes y matches en memoria.
 * En un entorno real, estos datos deberían almacenarse en una base de datos.
 */
const swipes = []; // Lista de interacciones entre usuarios (likes/dislikes)
const matches = []; // Lista de matches entre usuarios

/**
 * @function swipeUser
 * @desc    Registra un "like" o "dislike" de un usuario hacia otro.
 * @route   POST /api/swipes
 * @access  Público
 * @body    { userId: number, targetUserId: number, action: string }
 *          - `userId`: ID del usuario que realiza el swipe.
 *          - `targetUserId`: ID del usuario al que se dirige la acción.
 *          - `action`: "like" para mostrar interés, "dislike" para rechazar.
 * @returns {Object} Mensaje de confirmación y estado de match.
 */
const swipeUser = (req, res) => {
    const { userId, targetUserId, action } = req.body;

    // Validar que la acción sea "like" o "dislike"
    if (action !== 'like' && action !== 'dislike') {
        return res.status(400).json({ message: 'Invalid action' });
    }

    // Registrar el swipe en la lista de interacciones
    swipes.push({ userId, targetUserId, action });

    // Verificar si hay un match (ambos usuarios se dieron "like")
    const isMatch = swipes.some(swipe => 
        swipe.userId === targetUserId && 
        swipe.targetUserId === userId && 
        swipe.action === 'like'
    );

    // Si hay match, se guarda en la lista de matches
    if (isMatch) {
        matches.push({ user1: userId, user2: targetUserId });
        return res.json({ message: 'Swipe registered', match: true });
    }

    // Responder con el resultado del swipe
    res.json({ message: 'Swipe registered', match: false });
};

// Exportación de funciones y lista de matches
module.exports = { swipeUser, matches };
