// server/utils/groq.js
const axios = require("axios");

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const endpoint = "https://api.groq.com/openai/v1/chat/completions";

exports.getLLMResponse = async (userMessage) => {
  try {
    const res = await axios.post(
      endpoint,
      {
        model: "mixtral-8x7b-32768",
        messages: [
          { role: "system", content: "You are a helpful e-commerce assistant." },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data.choices[0].message.content;
  } catch (err) {
    console.error("LLM API error:", err);
    return "Sorry, I'm unable to respond right now.";
  }
};
