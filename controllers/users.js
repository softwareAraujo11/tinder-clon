// controllers/users.js
// Importa el modelo de Usuario
const User = require('../models/User');
// Importa la función para generar UUIDs únicos
const { v4: uuidv4 } = require('uuid');

// Controlador para registrar un nuevo usuario
const registerUser = async (req, res) => {
  // Extrae los datos del cuerpo de la solicitud
  const { name, email, password, age, gender, location, profilePicture } = req.body;

  try {
    // Crea una nueva instancia del modelo User con un ID generado por uuid
    const newUser = new User({
      id: uuidv4(), // ID único para el usuario
      name,
      email,
      password,
      age,
      gender,
      location,
      profilePicture
    });

    // Guarda el nuevo usuario en la base de datos
    const savedUser = await newUser.save();

    // Responde con estado 201 (creado) y los datos del nuevo usuario
    res.status(201).json(savedUser);
  } catch (error) {
    // Maneja errores como validaciones fallidas o duplicidad de email
    res.status(400).json({ message: error.message });
  }
};

// Controlador para obtener todos los usuarios registrados
const getUsers = async (req, res) => {
  try {
    // Recupera todos los usuarios de la base de datos
    const users = await User.find();
    res.json(users); // Devuelve la lista en formato JSON
  } catch (error) {
    // Manejo de errores de conexión o consulta
    res.status(500).json({ message: error.message });
  }
};

// Exporta ambos controladores para su uso en las rutas correspondientes
module.exports = { getUsers, registerUser };
