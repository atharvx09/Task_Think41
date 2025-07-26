import MessageList from "./MessageList";
import UserInput from "./UserInput";
import { useChat } from "../context/ChatContext";

const ChatWindow = () => {
  const { loading } = useChat();

  return (
    <div className="chat-window">
      <aside className="sidebar">{/* ConversationHistoryPanel here */}</aside>
      <main className="chat-main">
        <MessageList />
        {loading && <div className="loading">🤖 Typing...</div>}
        <UserInput />
      </main>
    </div>
  );
};

export default ChatWindow;
