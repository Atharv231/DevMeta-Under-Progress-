import { motion } from "framer-motion";
import { MessageCircle, AtSign, Reply } from "lucide-react";
import GlowOrb from "./GlowOrb";
import "./CommunicationSection.css";

const messages = [
  {
    user: "Sarah",
    message: "Should we refactor this to use hooks?",
    color: "hsl(186 100% 45%)",
  },
  {
    user: "Alex",
    message: "@Sarah Yes! I'll start with the state management.",
    color: "hsl(263 70% 50%)",
  },
  {
    user: "Jordan",
    message: "I can handle the useEffect cleanup.",
    color: "hsl(45 100% 50%)",
  },
];

const CommunicationSection = () => {
  return (
    <section className="comm-section">
      <GlowOrb size={400} color="cyan" className="comm-glow" />

      <div className="comm-container">
        <div className="comm-grid">
          {/* Chat visualization */}
          <motion.div
            className="chat-wrapper"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="chat-box glass gradient-border">
              {/* Header */}
              <div className="chat-header">
                <MessageCircle className="icon-cyan" />
                <span className="chat-title">Team Chat</span>
                <div className="chat-status">
                  <span className="status-dot" />
                  <span className="status-text">3 online</span>
                </div>
              </div>

              {/* Messages */}
              <div className="chat-messages">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    className="chat-message"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                  >
                    <div
                      className="avatar"
                      style={{ backgroundColor: msg.color }}
                    >
                      {msg.user[0]}
                    </div>

                    <div className="message-body">
                      <div className="message-meta">
                        <span className="username" style={{ color: msg.color }}>
                          {msg.user}
                        </span>
                        <span className="time">just now</span>
                      </div>
                      <p className="message-text">{msg.message}</p>
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                <motion.div
                  className="typing-indicator"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="avatar muted">M</div>
                  <span>Maya is typing</span>
                  <div className="typing-dots">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="dot"
                        animate={{ y: [0, -3, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Input */}
              <div className="chat-input">
                <input type="text" placeholder="Type a message..." disabled />
                <AtSign />
                <Reply />
              </div>
            </div>

            {/* Code reference */}
            <motion.div
              className="code-ref"
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <div className="code-line" />
              <span className="code-label">Line 42</span>
            </motion.div>
          </motion.div>

          {/* Right content */}
          <motion.div
            className="comm-content"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="pill">
              <MessageCircle className="icon-cyan" />
              <span>Built-in Communication</span>
            </div>

            <h2 className="comm-title">
              Discuss <span className="gradient-text">Without</span> Context
              Switching
            </h2>

            <p className="comm-desc">
              Chat, comment, and collaborate directly in your editor. Reference
              code lines, tag teammates, and keep conversations connected.
            </p>

            <ul className="comm-features">
              {[
                "Inline code comments and discussions",
                "Thread-based conversations",
                "Direct mentions and notifications",
                "Voice and video integration",
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="feature-dot" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CommunicationSection;
