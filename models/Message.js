// models/Message.js
// Importa Mongoose para la definición del esquema
const mongoose = require('mongoose');
// Importa la función para generar identificadores UUID
const { v4: uuidv4 } = require('uuid');

// Define el esquema del modelo Message para almacenar mensajes entre usuarios
const messageSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,   // Se genera automáticamente un UUID para cada mensaje
    primaryKey: true   // Se marca como clave primaria (aunque Mongoose usa _id por defecto)
  },
  senderId: {
    type: String,
    ref: 'User',       // Referencia al usuario que envía el mensaje
    required: true     // Campo obligatorio
  },
  receiverId: {
    type: String,
    ref: 'User',       // Referencia al usuario que recibe el mensaje
    required: true
  },
  content: {
    type: String,
    required: true     // El contenido del mensaje es obligatorio
  },
  timestamp: {
    type: Date,
    default: Date.now  // Se asigna la fecha y hora actual automáticamente
  }
});

// Exporta el modelo "Message" basado en el esquema definido
module.exports = mongoose.model('Message', messageSchema);
