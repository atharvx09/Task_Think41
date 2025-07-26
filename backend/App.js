// app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const chatbotRoutes = require("./routes/chatbotRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your MongoDB URI
mongoose.connect("mongodb://localhost:27017/ecommerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

app.use("/api/chatbot", chatbotRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
