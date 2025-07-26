

// routes/chatbotRoutes.js
const express = require("express");
const { handleChatMessage } = require("../controllers/chatbotController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/", authMiddleware, handleChatMessage);
module.exports = router;
