const mongoose = require('mongoose');

const FabricSchema = new mongoose.Schema({
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

const Fabric = mongoose.model('Fabric', FabricSchema);
module.exports = Fabric;
