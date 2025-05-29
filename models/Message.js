// models/Message.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const messageSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true
  },
  senderUuid: {
    type: String,
    required: true,
    ref: 'User'
  },
  receiverUuid: {
    type: String,
    required: true,
    ref: 'User'
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', messageSchema);
