import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";
import "./RoomForm.css";

export default function RoomForm() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("");
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleJoined = ({ roomId: serverRoomId }) => {
      localStorage.setItem("roomId", roomId);
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);

      navigate(`/editor/${serverRoomId || roomId}`);
    };

    const handleError = (msg) => setError(msg);

    socket.on("joined", handleJoined);
    socket.on("error", handleError);

    return () => {
      socket.off("joined", handleJoined);
      socket.off("error", handleError);
    };
  }, [navigate, roomId, username, password]);

  // ✅ ADDED (NO IMPACT ON EXISTING LOGIC)
  const generateId = () =>
    setRoomId(Math.random().toString(36).substring(2, 9).toUpperCase());

  const submit = () => {
    socket.emit(mode === "create" ? "create-room" : "join-room", {
      roomId,
      password,
      username,
    });
  };

  return (
    <div className="laptop-wrapper">
      {/* LEFT SIDE: THE CONTENT HUB */}
      <div className="hero-section">
        <div className="hero-content">
          {/* <h1 className="logo2">
            Dev<span>Mate</span>
          </h1> */}
          <h2 className="hero-title">
            Code together, <br />
            anywhere in the world.
          </h2>
          <p className="hero-desc">
            The developer-first platform for real-time pair programming,
            technical interviews, and collaborative debugging.
          </p>

          <div className="feature-grid">
            <div className="feat-item">
              <span className="feat-icon">⚡</span>
              <div>
                <strong>Low Latency</strong>
                <p>Sub-50ms sync speed across continents.</p>
              </div>
            </div>
            <div className="feat-item">
              <span className="feat-icon">🔒</span>
              <div>
                <strong>End-to-End</strong>
                <p>Your code is never stored on our servers.</p>
              </div>
            </div>
            <div className="feat-item">
              <span className="feat-icon">🛠️</span>
              <div>
                <strong>Multi-Language</strong>
                <p>Syntax highlighting for 50+ languages.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: THE INTERACTIVE FORM */}
      <div className="form-section">
        <div className="auth-card">
          {!mode ? (
            <div className="mode-selection fade-in">
              <h3 className="form-heading">Welcome Back</h3>
              <p className="form-subtext">
                Choose your entry point to the workspace.
              </p>
              <button className="btn-primary" onClick={() => setMode("create")}>
                Create New Workspace
              </button>
              <div className="divider">
                <span>OR</span>
              </div>
              <button className="btn-outline" onClick={() => setMode("join")}>
                Join via Room Invitation
              </button>
            </div>
          ) : (
            <div className="actual-form slide-left">
              <button className="back-btn" onClick={() => setMode("")}>
                ← Back to options
              </button>
              <h3 className="form-heading">
                {mode === "create" ? "Start Session" : "Join Session"}
              </h3>

              <div className="field">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Room ID</label>
                <div className="row">
                  <input
                    type="text"
                    placeholder="ABC-123"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                  />
                  {mode === "create" && (
                    <button className="gen-link" onClick={generateId}>
                      Generate
                    </button>
                  )}
                </div>
              </div>

              <div className="field">
                <label>Security Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                className="btn-primary main-btn"
                onClick={() =>
                  socket.emit(mode === "create" ? "create-room" : "join-room", {
                    roomId,
                    password,
                    username,
                  })
                }
              >
                {mode === "create" ? "Launch Editor" : "Enter Room"}
              </button>
              {error && <p className="err-toast">{error}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

<style></style>;
