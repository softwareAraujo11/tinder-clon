// controllers/swipes.js
// Importa el modelo de Swipes para registrar likes/dislikes
const Swipe = require('../models/Swipe');
// Importa el modelo de Matches para registrar coincidencias
const Match = require('../models/Match');
// Importa el modelo de Usuarios para validar existencia de los usuarios
const User = require('../models/User');

// Controlador que maneja la acción de "like" o "dislike" entre usuarios
const swipeUser = async (req, res) => {
  // Extrae los datos necesarios del cuerpo de la solicitud
  const { userId, targetUserId, action } = req.body;

  // Valida que la acción sea válida ("like" o "dislike")
  if (action !== 'like' && action !== 'dislike') {
    return res.status(400).json({ message: 'Invalid action' });
  }

  try {
    // Verifica que tanto el usuario origen como el destino existan
    const originUser = await User.findOne({ id: userId });
    const targetUser = await User.findOne({ id: targetUserId });

    if (!originUser || !targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Crea un nuevo registro de swipe
    const newSwipe = new Swipe({ originUserId: userId, targetUserId, action });
    await newSwipe.save();

    // Verifica si el usuario objetivo también hizo "like" al usuario actual
    const existingSwipe = await Swipe.findOne({
      originUserId: targetUserId,
      targetUserId: userId,
      action: 'like'
    });

    // Si ambos usuarios se dieron "like", se crea un nuevo match
    if (existingSwipe && action === 'like') {
      const newMatch = new Match({ user1Id: userId, user2Id: targetUserId });
      await newMatch.save();
      return res.json({ message: 'Swipe registered', match: true });
    }

    // Si no hay match, solo se registra el swipe
    res.json({ message: 'Swipe registered', match: false });
  } catch (error) {
    // Manejo de errores en la operación
    res.status(500).json({ message: error.message });
  }
};

// Exporta el controlador para ser utilizado en las rutas de swipes
module.exports = { swipeUser };
