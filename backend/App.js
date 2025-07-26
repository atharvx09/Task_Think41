// app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const chatbotRoutes = require("./routes/chatbotRoutes");
const authRoutes = require("./routes/authRoutes"); // Optional

dotenv.config(); // Load environment variables

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/auth", authRoutes); // Optional: Login/Register routes

// Health Check
app.get("/", (req, res) => {
  res.send("🚀 Backend is up and running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
