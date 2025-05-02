// models/Match.js
// Importa Mongoose para definir el esquema del modelo
const mongoose = require('mongoose');
// Importa la función para generar UUIDs únicos
const { v4: uuidv4 } = require('uuid');

// Define el esquema de un "match" entre dos usuarios
const matchSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,  // Genera un UUID automáticamente
    primaryKey: true  // Marca este campo como clave primaria (aunque Mongoose usa _id por defecto)
  },
  user1Id: {
    type: String,
    ref: 'User',      // Referencia al modelo User
    required: true    // Campo obligatorio
  },
  user2Id: {
    type: String,
    ref: 'User',      // También referencia al modelo User
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now // Fecha y hora de creación del match
  }
});

// Exporta el modelo de Mongoose llamado "Match" basado en el esquema anterior
module.exports = mongoose.model('Match', matchSchema);
