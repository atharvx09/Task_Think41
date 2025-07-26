import React, { createContext, useContext, useState } from "react";
import api from "../services/api";

type Message = {
  sender: "user" | "ai";
  content: string;
};

type ChatContextType = {
  messages: Message[];
  loading: boolean;
  sendMessage: (msg: string) => void;
};

const ChatContext = createContext<ChatContextType>({} as ChatContextType);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
const [conversations, setConversations] = useState<Conversation[]>([]);
const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

const fetchHistory = async () => {
  const res = await api.get("/chat/history");
  setConversations(res.data);
};

const loadConversation = async (id: string) => {
  const res = await api.get(`/chat/history/${id}`);
  setMessages(res.data.messages);
  setCurrentConversationId(id);
};


  const sendMessage = async (msg: string) => {
    setMessages((prev) => [...prev, { sender: "user", content: msg }]);
    setLoading(true);
    try {
      const res = await api.post("/chatbot", { message: msg });
      setMessages((prev) => [...prev, { sender: "ai", content: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "ai", content: "Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, loading, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
