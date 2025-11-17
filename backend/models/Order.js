const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        quantity: Number,
        imageUrls: [{ type: String }], // ✅ store multiple images here
        size: { type: String, default: null },   // optional
      },
    ],
    totalAmount: Number,
    currency: String,
    paymentMethod: { type: String, enum: ["COD", "Card"], default: "COD" },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
