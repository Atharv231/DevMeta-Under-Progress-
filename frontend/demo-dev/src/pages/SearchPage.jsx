import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket/socket";

export default function SearchPage() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi 👋 I’m your AI assistant. Ask me anything.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([
    { id: 1, title: "New Chat", messages: [] },
  ]);
  const [activeChat, setActiveChat] = useState(1);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit("join-chat-room", { roomId });

    return () => {
      socket.emit("leave-chat-room", { roomId });
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function startNewChat() {
    const id = Date.now();
    setChats((c) => [...c, { id, title: "New Chat", messages: [] }]);
    setActiveChat(id);
    setMessages([
      { role: "assistant", content: "New conversation started ✨" },
    ]);
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      // 🔁 Replace this fetch with your real AI backend
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      const aiMessage = {
        role: "assistant",
        content: data.reply || "(Demo response) I am thinking intelligently 🤖",
      };

      setMessages((m) => [...m, aiMessage]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "⚠️ Error contacting AI server." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.app}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>AI</div>
        <button style={styles.newChatBtn} onClick={startNewChat}>
          + New
        </button>
        <div style={styles.chatList}>
          {chats.map((c) => (
            <div
              key={c.id}
              onClick={() => setActiveChat(c.id)}
              style={{
                ...styles.chatItem,
                background:
                  c.id === activeChat ? "rgba(255,255,255,0.1)" : "transparent",
              }}
            >
              {c.title}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div style={styles.chatArea}>
        <div style={styles.messages}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.message,
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                background:
                  msg.role === "user"
                    ? "linear-gradient(135deg,#6366f1,#4f46e5)"
                    : "rgba(255,255,255,0.08)",
              }}
            >
              {msg.content}
            </div>
          ))}
          {loading && (
            <div style={{ ...styles.message, opacity: 0.6 }}>
              AI is typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={styles.inputBar}>
          <textarea
            style={styles.textarea}
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button style={styles.sendBtn} onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================== INLINE STYLES ================== */

const styles = {
  app: {
    display: "flex",
    height: "100vh",
    background: "radial-gradient(circle at top,#111,#000)",
    color: "white",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  sidebar: {
    width: "240px",
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(14px)",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
  },
  logo: {
    fontSize: "22px",
    fontWeight: 700,
    marginBottom: "16px",
  },
  newChatBtn: {
    background: "linear-gradient(135deg,#22d3ee,#6366f1)",
    border: "none",
    borderRadius: "10px",
    padding: "10px",
    color: "black",
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: "16px",
  },
  chatList: {
    flex: 1,
    overflowY: "auto",
  },
  chatItem: {
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    opacity: 0.85,
    marginBottom: "6px",
  },
  chatArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  messages: {
    flex: 1,
    padding: "24px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  message: {
    maxWidth: "70%",
    padding: "14px",
    borderRadius: "16px",
    lineHeight: 1.5,
    whiteSpace: "pre-wrap",
  },
  inputBar: {
    display: "flex",
    gap: "12px",
    padding: "16px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
  },
  textarea: {
    flex: 1,
    resize: "none",
    borderRadius: "12px",
    padding: "12px",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    border: "none",
    outline: "none",
    fontSize: "14px",
  },
  sendBtn: {
    background: "linear-gradient(135deg,#4ade80,#22c55e)",
    border: "none",
    borderRadius: "12px",
    padding: "0 20px",
    fontWeight: 700,
    cursor: "pointer",
  },
};
