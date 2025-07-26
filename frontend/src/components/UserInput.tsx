import { useChat } from "../context/ChatContext";
import { useState } from "react";

const UserInput = () => {
  const { sendMessage } = useChat();
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="user-input">
      <input
        type="text"
        value={input}
        placeholder="Ask something..."
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default UserInput;
