// models/Message.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const messageSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,  
    primaryKey: true   
  },
  senderId: {
    type: String,
    ref: 'User',     
    required: true  
  },
  receiverId: {
    type: String,
    ref: 'User',    
    required: true
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
