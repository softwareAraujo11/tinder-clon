// models/Match.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


const matchSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,  
    primaryKey: true  
  },
  user1Id: {
    type: String,
    ref: 'User',      
    required: true    
  },
  user2Id: {
    type: String,
    ref: 'User',      
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now 
  }
});

module.exports = mongoose.model('Match', matchSchema);
