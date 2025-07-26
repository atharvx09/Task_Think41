// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  password: String, // optional for testing
  gender: String,
  age: Number,
  created_at: Date
});

// Password hash hook (optional for registration)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);
