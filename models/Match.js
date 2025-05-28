// models/Match.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const matchSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true
  },
  user1Uuid: {
    type: String,
    ref: 'User',
    required: true
  },
  user2Uuid: {
    type: String,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Match', matchSchema);
