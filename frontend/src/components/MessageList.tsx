import { useChat } from "../context/ChatContext";
import Message from "./Message";

const MessageList = () => {
  const { messages } = useChat();

  return (
    <div className="message-list">
      {messages.map((msg, idx) => (
        <Message key={idx} {...msg} />
      ))}
    </div>
  );
};

export default MessageList;

