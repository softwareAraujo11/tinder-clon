// controllers/auth.js
// Importa el modelo de usuario para consultar la base de datos
const User = require('../models/User');

// Controlador para el inicio de sesión de usuarios
const loginUser = async (req, res) => {
  // Extrae el correo electrónico y la contraseña del cuerpo de la solicitud
  const { email, password } = req.body;

  try {
    // Busca un usuario que coincida con el email y la contraseña proporcionados
    const user = await User.findOne({ email: email, password: password });

    if (user) {
      // Si se encuentra el usuario, retorna un mensaje de éxito con el objeto del usuario
      res.json({ message: 'Login successful', user });
    } else {
      // Si no se encuentra, responde con estado 401 (no autorizado)
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    // Manejo de errores en caso de fallos en la consulta
    res.status(500).json({ message: error.message });
  }
};

// Exporta el controlador para que pueda ser usado en las rutas
module.exports = { loginUser };
