// models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  brand: { type: String, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrls: { type: [String], required: true }   // <- MULTIPLE IMAGES
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
