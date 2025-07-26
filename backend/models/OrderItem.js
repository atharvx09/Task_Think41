// models/OrderItem.js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  order_id: Number,
  user_id: Number,
  product_id: Number,
  inventory_item_id: Number,
  status: String,
  created_at: Date,
  shipped_at: Date,
  delivered_at: Date,
  returned_at: Date
});

module.exports = mongoose.model("OrderItem", orderItemSchema);
