const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4
  },
  name: { type: String, required: true },
  age: Number,
  gender: String,
  location: String,
  interests: { type: [String], default: [] },
  profilePicture: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true } // ✅ obligatorio
});

module.exports = mongoose.model('User', userSchema);
