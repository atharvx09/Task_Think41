import { useChat } from "../context/ChatContext";

const ConversationHistory = () => {
  const { conversations, loadConversation } = useChat();

  return (
    <div className="conversation-history">
      <h3>Past Conversations</h3>
      <ul>
        {conversations.map((conv) => (
          <li key={conv._id} onClick={() => loadConversation(conv._id)}>
            🗨️ {new Date(conv.created_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationHistory;

