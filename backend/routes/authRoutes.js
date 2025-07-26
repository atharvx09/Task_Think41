// routes/authRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || "supersecretkey",
    { expiresIn: "1d" }
  );

  res.json({ token, user });
});

module.exports = router;
