// models/Swipe.js
// Importa Mongoose para definir el esquema del modelo
const mongoose = require('mongoose');
// Importa la función para generar UUIDs únicos
const { v4: uuidv4 } = require('uuid');

// Define el esquema para los registros de "swipe" (acciones de like o dislike)
const swipeSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,   // Genera un identificador único por defecto
    primaryKey: true   // Se marca como clave primaria (aunque Mongoose utiliza _id internamente)
  },
  originUserId: {
    type: String,
    ref: 'User',       // Usuario que realiza el swipe
    required: true     // Campo obligatorio
  },
  targetUserId: {
    type: String,
    ref: 'User',       // Usuario al que se le hace el swipe
    required: true
  },
  action: {
    type: String,
    enum: ['like', 'dislike'], // Acción permitida: "like" o "dislike"
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now  // Fecha y hora en que se realiza el swipe
  }
});

// Exporta el modelo "Swipe" para interactuar con la colección en MongoDB
module.exports = mongoose.model('Swipe', swipeSchema);
