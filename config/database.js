// config/database.js
// Carga las variables de entorno definidas en el archivo .env
require('dotenv').config();

// Importa Mongoose, una biblioteca ODM para MongoDB
const mongoose = require('mongoose');

// Función asíncrona para conectar a la base de datos MongoDB Atlas
const connectDB = async () => {
  try {
    // Intenta establecer la conexión usando la URI definida en el archivo .env
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,        // Usa el nuevo parser de URLs de MongoDB
      useUnifiedTopology: true,     // Usa el nuevo motor de topología unificada
    });
    console.log('Connected to MongoDB Atlas'); // Mensaje de éxito en la conexión
  } catch (error) {
    // En caso de error, lo muestra en consola y detiene el proceso
    console.error('MongoDB Atlas connection error:', error);
    process.exit(1); // Finaliza la ejecución del servidor
  }
};

// Exporta la función para que pueda ser utilizada desde otros archivos
module.exports = connectDB;
