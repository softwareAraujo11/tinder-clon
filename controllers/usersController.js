const User = require('../models/User');

exports.createUser = async (req, res) => {
  try {
    const {
      id,
      nombre,
      edad,
      genero,
      preferencias,
      ubicacion,
      fotoPerfil,
    } = req.body;

    const existingUser = await User.findOne({ id });
    if (existingUser) {
      return res.status(409).json({ message: 'Ya existe un usuario con este ID.' });
    }

    const newUser = new User({
      id,
      nombre,
      edad,
      genero,
      preferencias,
      ubicacion,
      fotoPerfil,
    });

    await newUser.save();

    res.status(201).json({ message: 'Usuario creado exitosamente.', userId: newUser._id });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ message: 'Error al crear el usuario.' });
  }
};