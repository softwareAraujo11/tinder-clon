// controllers/users.js
const User = require('../models/User');
 const { v4: uuidv4 } = require('uuid');
 

 const registerUser = async (req, res) => {
  const { name, email, password, age, gender, location, profilePicture } = req.body;
 

  try {
  const newUser = new User({
  id: uuidv4(),
  name,
  email,
  password: password,
  age,
  gender,
  location,
  profilePicture
  });
 

  const savedUser = await newUser.save();
  res.status(201).json(savedUser);
  } catch (error) {
  res.status(400).json({ message: error.message });
  }
 };
 

 const getUsers = async (req, res) => {
  try {
  const users = await User.find();
  res.json(users);
  } catch (error) {
  res.status(500).json({ message: error.message });
  }
 };
 

 module.exports = { getUsers, registerUser };