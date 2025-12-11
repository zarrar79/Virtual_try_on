// models/Product.js
const mongoose = require('mongoose');

const DesignSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 }
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  brand: { type: String, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  designs: [DesignSchema],
  // New optional fields
  fabric: { type: String, trim: true },
  pattern: { type: String, trim: true },
  sizes: [{ type: String, enum: ['S', 'M', 'L'] }]
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;