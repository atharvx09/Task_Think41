// routes/chatbotRoutes.js
const express = require("express");
const router = express.Router();
const { handleChatMessage } = require("../controllers/chatbotController");

router.post("/", handleChatMessage);

module.exports = router;
