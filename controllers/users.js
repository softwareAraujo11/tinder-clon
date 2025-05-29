// controllers/users.js
const User = require('../models/User');

const registerOrUpdateUser = async (req, res) => {
  const { email, name, location, interests, profilePicture, uuid } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.name = name;
      existingUser.location = location;
      existingUser.interests = interests;
      existingUser.profilePicture = profilePicture;
      existingUser.uuid = uuid;
      await existingUser.save();
      return res.status(200).json(existingUser);
    }

    const newUser = new User({ email, name, location, interests, profilePicture, uuid });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar o actualizar usuario' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

const getSuggestedUsers = async (req, res) => {
  const { uuid } = req.params;

  try {
    const currentUser = await User.findOne({ uuid });

    if (!currentUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const suggestions = await User.find({
      uuid: { $ne: uuid },
      location: currentUser.location,
      interests: { $in: currentUser.interests }
    });

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener sugerencias' });
  }
};

const updateUser = async (req, res) => {
  const { uuid } = req.params;
  const updates = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate({ uuid }, updates, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};

const getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado por email' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario por email' });
  }
};

module.exports = {
  registerOrUpdateUser,
  getUsers,
  getSuggestedUsers,
  updateUser,
  getUserByEmail
};
