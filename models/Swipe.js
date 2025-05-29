// models/Swipe.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const swipeSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true
  },
  originUserUuid: {
    type: String,
    ref: 'User',
    required: true
  },
  targetUserUuid: {
    type: String,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: ['like', 'dislike'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Swipe', swipeSchema);
