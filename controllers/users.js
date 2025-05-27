// controllers/users.js
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

const registerOrUpdateUser = async (req, res) => {
  const { name, email, password, age, gender, location, interests, profilePicture } = req.body;

  console.log('📥 Datos recibidos del frontend:', req.body);

  try {
    let user = await User.findOne({ email });

    if (user) {
      user.name = name;
      user.age = age;
      user.gender = gender;
      user.location = location;
      user.interests = interests;
      user.profilePicture = profilePicture;

      const updatedUser = await user.save();
      return res.status(200).json(updatedUser);
    } else {
      const newUser = new User({
        id: uuidv4(),
        name,
        email,
        password,
        age,
        gender,
        location,
        interests,
        profilePicture
      });

      const savedUser = await newUser.save();
      return res.status(201).json(savedUser);
    }
  } catch (error) {
    console.error('❌ Error al guardar usuario:', error.message);
    return res.status(400).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const { location, interests } = req.query;
    let filter = {};

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (interests) {
      const interestArray = interests.split(',').map(i => i.trim());
      filter.interests = { $in: interestArray };
    }

    const users = await User.find(filter);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerOrUpdateUser,
  getUsers,
  updateUser,
};
