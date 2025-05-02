// models/User.js
// Importa Mongoose para definir el esquema del modelo
const mongoose = require('mongoose');
// Importa la función para generar identificadores UUID
const { v4: uuidv4 } = require('uuid');

// Define el esquema del modelo "User" (usuario de la aplicación)
const userSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,   // Genera automáticamente un UUID único para cada usuario
    primaryKey: true   // Se declara como clave primaria (aunque internamente Mongoose usa _id)
  },
  name: {
    type: String,
    required: true     // Nombre del usuario, obligatorio
  },
  age: {
    type: Number       // Edad del usuario, opcional
  },
  gender: {
    type: String       // Género del usuario, opcional
  },
  location: {
    type: String       // Ubicación geográfica (país, ciudad, etc.), opcional
  },
  profilePicture: {
    type: String       // URL de la imagen de perfil del usuario
  },
  email: {
    type: String,
    required: true,    // Correo electrónico, obligatorio
    unique: true       // No puede haber duplicados
  },
  password: {
    type: String,
    required: true     // Contraseña, obligatoria
  }
});

// Exporta el modelo "User" basado en el esquema definido
module.exports = mongoose.model('User', userSchema);
