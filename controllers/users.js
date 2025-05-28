// controllers/users.js
const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

const registerOrUpdateUser = async (req, res) => {
  const { email, name, profilePicture, password, age, gender, location, interests } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      user.name = name || user.name;
      user.profilePicture = profilePicture || user.profilePicture;
      user.password = password || user.password;
      user.age = age;
      user.gender = gender;
      user.location = location;
      user.interests = interests;
      await user.save();
      return res.json({ message: 'Usuario actualizado', user });
    }

    const newUser = new User({
      email,
      name,
      profilePicture,
      password: password || 'fromGoogleAuth',
      age,
      gender,
      location,
      interests
    });

    await newUser.save();
    res.json({ message: 'Usuario registrado', user: newUser });
  } catch (error) {
    console.error('Error al registrar o actualizar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getUserByUuid = async (req, res) => {
  const { uuid } = req.params;
  try {
    const user = await User.findOne({ uuid });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updateUser = async (req, res) => {
  const { uuid } = req.params;
  try {
    const updatedUser = await User.findOneAndUpdate({ uuid }, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getSuggestedUsers = async (req, res) => {
  const { uuid } = req.params;

  try {
    const currentUser = await User.findOne({ uuid });
    if (!currentUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const suggested = await User.find({
      uuid: { $ne: currentUser.uuid },
      location: currentUser.location,
      interests: { $in: currentUser.interests }
    });

    res.json(suggested);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener sugerencias' });
  }
};

module.exports = {
  getUsers,
  registerOrUpdateUser,
  getUserByUuid,
  updateUser,
  getSuggestedUsers
};
