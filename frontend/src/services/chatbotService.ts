// services/chatbotService.ts
import api from "./api";

export const sendMessageToChatbot = async (message: string) => {
  try {
    const res = await api.post("/chatbot", { message });
    return res.data;
  } catch (error) {
    console.error("Chatbot API error:", error);
    throw error;
  }
};
