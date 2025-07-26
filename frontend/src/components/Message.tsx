type MessageProps = {
  sender: "user" | "ai";
  content: string;
};

const Message = ({ sender, content }: MessageProps) => {
  return (
    <div className={`message ${sender}`}>
      <div className="message-bubble">{content}</div>
    </div>
  );
};

export default Message;
