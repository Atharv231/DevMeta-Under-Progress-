import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket/socket";
import "./ChatRoom.css";

export default function ChatRoom() {
  const { roomId } = useParams();
  const currentUsername = localStorage.getItem("username");
  const roomPassword = localStorage.getItem("password");

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [users, setUsers] = useState([]);
  const myUsernameRef = useRef(currentUsername); // 🆕 LOCK username

  const hasLoadedRef = useRef(false); // 🔑 IMPORTANT

  // ==============================
  // SAFETY GUARD
  // ==============================
  if (!currentUsername) {
    return <div style={{ padding: 20 }}>Username not found</div>;
  }

  // ==============================
  // LOAD MESSAGES FROM LOCALSTORAGE
  // ==============================
  useEffect(() => {
    if (!roomId || hasLoadedRef.current) return;

    const savedMessages = localStorage.getItem(`chat_messages_${roomId}`);
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch {
        setMessages([]);
      }
    }

    hasLoadedRef.current = true;
  }, [roomId]);

  // ==============================
  // SAVE MESSAGES TO LOCALSTORAGE
  // ==============================
  useEffect(() => {
    if (!roomId || !hasLoadedRef.current) return;

    localStorage.setItem(`chat_messages_${roomId}`, JSON.stringify(messages));
  }, [messages, roomId]);

  // ==============================
  // JOIN ROOM
  // ==============================
  useEffect(() => {
    if (!roomId || !currentUsername || !roomPassword) return;

    socket.emit("join-room", {
      roomId,
      password: roomPassword,
      username: currentUsername,
    });
  }, [roomId, currentUsername, roomPassword]);

  // ==============================
  // SOCKET LISTENERS
  // ==============================
  useEffect(() => {
    if (!roomId) return;

    const handleMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleUserList = (userList) => {
      setUsers(userList || []);
    };

    socket.on("message", handleMessage);
    socket.on("user-list", handleUserList);

    return () => {
      socket.off("message", handleMessage);
      socket.off("user-list", handleUserList);
    };
  }, [roomId]);

  // ==============================
  // SEND MESSAGE
  // ==============================
  const sendMessage = () => {
    if (!inputValue.trim()) return;

    socket.emit("send-message", {
      text: inputValue.trim(),
      username: myUsernameRef.current, // 🆕 ALWAYS correct
    });

    setInputValue("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const getInitial = (name) => name.charAt(0).toUpperCase();

  // ==============================
  // UI (UNCHANGED)
  // ==============================
  return (
    <div className="chat-room-container">
      <aside className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h3 className="chat-sidebar-title">Online Users</h3>
          <p className="chat-user-count">
            <span className="chat-user-count-dot"></span>
            <span>
              {users.length} user{users.length !== 1 ? "s" : ""} online
            </span>
          </p>
        </div>

        <div className="chat-user-list">
          {users.map((user, index) => (
            <div key={index} className="chat-user-item">
              <div className="chat-user-avatar">{getInitial(user)}</div>
              <span className="chat-user-name">{user}</span>
              <span className="chat-user-status"></span>
            </div>
          ))}
        </div>
      </aside>

      <main className="chat-main">
        <header className="chat-header">
          <div className="chat-room-info">
            <h2 className="chat-room-name">Chat Room</h2>
            <p className="chat-room-id">Room ID: {roomId}</p>
          </div>
          <div className="chat-header-actions">
            <div className="chat-header-user-count">
              <span className="chat-header-user-count-icon">👥</span>
              <span>{users.length} users</span>
            </div>
          </div>
        </header>

        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="chat-empty-message">
              <div className="chat-empty-icon">💬</div>
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${
                  message.username === myUsernameRef.current
                    ? "chat-message-own"
                    : ""
                }`}
              >
                <p className="chat-message-username">{message.username}</p>
                <p className="chat-message-text">{message.text}</p>
                <p className="chat-message-time">{message.time}</p>
              </div>
            ))
          )}
        </div>

        <div className="chat-input-area">
          <input
            className="chat-input"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button className="chat-send-button" onClick={sendMessage}>
            Send
          </button>
        </div>
      </main>
    </div>
  );
}
