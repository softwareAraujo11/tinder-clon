// models/User.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true
  },
  email: { type: String, required: true, unique: true },
  name: String,
  profilePicture: String, 
  age: Number,
  gender: String,
  location: String,
  interests: [String],
  password: String
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
