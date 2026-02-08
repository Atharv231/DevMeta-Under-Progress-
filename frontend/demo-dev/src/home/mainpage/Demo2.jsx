import { motion } from "framer-motion";
import { Bot, Sparkles, Lightbulb, Bug } from "lucide-react";
import GlowOrb from "./GlowOrb";
import "./demo.css";
import RealtimeSection from "./RealtimeSection";

import useSmoothScroll from "./useSmoothScroll";

const aiFeatures = [
  {
    icon: Bug,
    title: "Bug Detection",
    description:
      "AI automatically identifies and suggests fixes for bugs in real-time.",
  },
  {
    icon: Lightbulb,
    title: "Smart Suggestions",
    description:
      "Get intelligent code completions based on your project context.",
  },
  {
    icon: Sparkles,
    title: "Code Explanation",
    description: "Let AI explain complex code snippets to your entire team.",
  },
];

const Demo2 = () => {
  return (
    <>
      <section className="ai-section">
        <GlowOrb size={600} color="violet" className="ai-glow-orb" />

        <div className="ai-container">
          {/* Header */}
          <motion.div
            className="ai-header"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="ai-pill"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Bot className="ai-pill-icon" />
              <span>AI-Powered</span>
            </motion.div>

            <h2 className="ai-title">
              Your AI <span>Co-Pilot</span>
            </h2>

            <p className="ai-subtitle">
              An intelligent assistant that understands your code, anticipates
              your needs, and helps your entire team code faster.
            </p>
          </motion.div>

          {/* Visualization */}
          <div className="ai-visual-wrapper">
            <motion.div
              className="ai-visual"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="ai-chat">
                {/* User */}
                <motion.div
                  className="ai-message user"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="avatar user-avatar">👤</div>
                  <div className="bubble">
                    Why is this function throwing an error?
                  </div>
                </motion.div>

                {/* AI */}
                <motion.div
                  className="ai-message bot"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="bubble">
                    The error occurs because <code>userData</code> is undefined.
                    Add a null check:
                    <pre>
                      {`if (userData?.id) {
  // safe access
}`}
                    </pre>
                  </div>
                  <div className="avatar bot-avatar">
                    <Bot />
                  </div>
                </motion.div>

                {/* Typing */}
                <motion.div
                  className="ai-typing"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Bot />
                  <span>AI is analyzing your code...</span>
                  <span className="dots">
                    <i />
                    <i />
                    <i />
                  </span>
                </motion.div>
              </div>

              {/* Neural dots */}
              <div className="neural-dots">
                {[...Array(5)].map((_, i) => (
                  <motion.span
                    key={i}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Features */}
          <div className="ai-features">
            {aiFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="ai-card animated-border-wrapper"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Glow layers */}
                <div className="animated-border-box-glow"></div>

                {/* Card content */}
                <div className="ai-card-content">
                  <div className="ai-card-icon">
                    <feature.icon />
                  </div>
                  <h3 className="d1">{feature.title}</h3>
                  <p className="d2">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Demo2;
