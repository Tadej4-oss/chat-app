import { useState, type FormEvent, type RefObject } from "react";
import type { Conversation } from "../../ChatTypes";

type ChatPanelProps = {
  username?: string;
  roomName?: string;
  conversations: Conversation[];
  isTyping: boolean;
  typingUser: string;
  bottomRef: RefObject<HTMLDivElement | null>;
  onSendMessage: (message: string) => Promise<void>;
  onTyping: () => void;
};

export default function ChatPanel({
  username,
  roomName,
  conversations,
  isTyping,
  typingUser,
  bottomRef,
  onSendMessage,
  onTyping,
}: ChatPanelProps) {
  const [message, setMessage] = useState("");

  async function handleMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    await onSendMessage(message);
    
    setMessage("");
  }

  function handleChange(value: string) {
    setMessage(value);
    onTyping();
  }

  return (
    <main className="chat-main">
      <header className="chat-header">
        <div>
          <span className="header-label">CHAT SPACE</span>
          <h1>
            Welcome, {username} <span>✦</span>
          </h1>
        </div>
        <div className="active-room"># {roomName}</div>
      </header>

      <div className="chat-messages">
        {conversations?.map((msg, index) => (
          <div
            className={`message-row ${msg.username === username ? "own" : ""}`}
            key={index}
          >
            <div className="message-bubble">
              <span className="message-author">{msg.username}</span>
              <p>{msg.contexts}</p>
            </div>
            <div ref={bottomRef} style={{ height: "1px" }} />
          </div>
        ))}
      </div>
      <p className="typing-indicator">
        {isTyping ? `${typingUser} is typing...` : ""}
      </p>

      <form onSubmit={handleMessage} className="chat-input-area">
        <input
          value={message}
          onChange={(event) => handleChange(event.target.value)}
          type="text"
          placeholder="Type your message..."
        />
        <button type="submit" aria-label="Send message">
          ➤
        </button>
      </form>
    </main>
  );
}
