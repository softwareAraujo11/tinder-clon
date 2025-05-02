// controllers/messages.js
// Importa el modelo de mensajes para realizar operaciones en la colección "messages"
const Message = require('../models/Message');

// Controlador para obtener todos los mensajes entre dos usuarios
const getMessages = async (req, res) => {
    try {
        // Extrae los IDs de los dos usuarios desde los parámetros de la URL
        const { user1Id, user2Id } = req.params;

        // Busca los mensajes donde user1 es remitente y user2 es receptor o viceversa
        const messages = await Message.find({
            $or: [
                { senderId: user1Id, receiverId: user2Id },
                { senderId: user2Id, receiverId: user1Id }
            ]
        }).sort({ timestamp: 1 }); // Ordena los mensajes por fecha ascendente

        // Devuelve la lista de mensajes encontrados
        res.json(messages);
    } catch (error) {
        // Manejo de errores
        res.status(500).json({ message: error.message });
    }
};

// Exporta el controlador para ser usado en el archivo de rutas correspondiente
module.exports = { getMessages };
