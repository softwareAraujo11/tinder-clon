// controllers/matches.js
// Importa el modelo de Match para acceder a los emparejamientos (matches)
const Match = require('../models/Match');
// Importa el modelo de Usuario para poblar los datos relacionados
const User = require('../models/User');

// Controlador para obtener todos los matches registrados
const getMatches = async (req, res) => {
  try {
    // Consulta todos los documentos en la colección "matches"
    const matches = await Match.find()
      // Llena (popula) la información del usuario 1, excluyendo su contraseña
      .populate({ path: 'user1Id', select: '-password', foreignField: 'id', localField: 'user1Id' })
      // Llena la información del usuario 2, también excluyendo su contraseña
      .populate({ path: 'user2Id', select: '-password', foreignField: 'id', localField: 'user2Id' });

    // Devuelve la lista de matches encontrados
    res.json({ matches });
  } catch (error) {
    // Maneja cualquier error ocurrido durante la consulta
    res.status(500).json({ message: error.message });
  }
};

// Exporta el controlador para ser utilizado en las rutas
module.exports = { getMatches };

