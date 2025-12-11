const mongoose = require('mongoose');

const PatternSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  description: { 
    type: String,
    trim: true
  },
  imageUrl: { 
    type: String 
  }
}, { 
  timestamps: true 
});

const Pattern = mongoose.model('Pattern', PatternSchema);
module.exports = Pattern;
