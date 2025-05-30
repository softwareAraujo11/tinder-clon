// controllers/users.js
const User = require('../models/User');
const Swipe = require('../models/Swipe');

const registerOrUpdateUser = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      user.set(req.body);
    } else {
      user = new User(req.body);
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar o actualizar usuario' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

const getSuggestedUsers = async (req, res) => {
  const { uuid } = req.params;
  try {
    const currentUser = await User.findOne({ uuid });

    if (!currentUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const swipedUuids = await Swipe.find({ originUserUuid: uuid }).distinct('targetUserUuid');

    const suggested = await User.find({
      uuid: { $nin: [...swipedUuids, uuid] },
      location: currentUser.location,
      interests: { $in: currentUser.interests }
    });

    res.status(200).json(suggested);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener sugerencias' });
  }
};

const updateUser = async (req, res) => {
  const { uuid } = req.params;

  try {
    const updated = await User.findOneAndUpdate({ uuid }, req.body, {
      new: true
    });

    if (!updated) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

const getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar usuario' });
  }
};

module.exports = {
  registerOrUpdateUser,
  getUsers,
  getSuggestedUsers,
  updateUser,
  getUserByEmail
};