// server/models/Conversation.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ["user", "ai"], required: true },
  content: String,
  timestamp: { type: Date, default: Date.now },
});

const conversationSchema = new mongoose.Schema({
  user_id: { type: Number, required: true },
  messages: [messageSchema],
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Conversation", conversationSchema);
