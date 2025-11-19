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
        imageUrls: [{ type: String }],
        designIndex: Number, // Which design was selected (0, 1, 2, etc.)
        designStock: Number, // Original stock at time of order
        size: { type: String, default: null },
        color: { type: String, default: null },
        itemTotal: Number, // price * quantity for this specific design
      },
    ],
    totalAmount: Number,
    totalQuantity: Number, // Total items across all designs
    currency: { type: String, default: "PKR" },
    paymentMethod: { type: String, enum: ["COD", "Card"], default: "COD" },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);