// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  order_id: { type: Number, required: true, unique: true },
  user_id: { type: Number, required: true },
  status: { type: String, required: true },
  gender: String,
  created_at: Date,
  returned_at: Date,
  shipped_at: Date,
  delivered_at: Date,
  num_of_item: Number
});

module.exports = mongoose.model("Order", orderSchema);
