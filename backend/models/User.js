// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  orders :[],
  resetToken: String,
  resetTokenExpiry: Date,
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
