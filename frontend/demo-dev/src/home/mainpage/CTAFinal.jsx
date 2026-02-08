import { motion } from "framer-motion";
import "./CTAFinal.css";

import heroMockup from "../../assets/cta-hero-mockup.png";

export const CTAFinal = () => {
  return (
    <section className="cta-section">
      {/* Background */}
      {/* Content */}
      <div className="cta-wrapper">
        {/* Title */}
        <motion.h2
          className="cta-title"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="cta-title-line cta-title-italic">
            Join the <span className="gradient-text">future</span>
          </span>
          <span className="cta-title-line">of building</span>
        </motion.h2>

        {/* Button */}

        {/* Mockup */}
        <motion.div
          className="cta-mockup-container"
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <img
            src={heroMockup}
            alt="Devmet Platform"
            className="cta-mockup-image"
          />

          {/* Floating Users */}
          <motion.div
            className="cta-users-floating"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="cta-user-bubble">
              <div className="cta-user-avatar cta-user-avatar-1">TZ_B</div>
              <div className="cta-user-info">
                <div className="cta-user-name">Atharv Ahire</div>
                <div className="cta-user-status">
                  <span className="cta-user-status-dot" />
                  Editing main.tsx
                </div>
              </div>
            </div>
            <div className="cta-user-bubble">
              <div className="cta-user-avatar cta-user-avatar-2">TZ_I</div>
              <div className="cta-user-info">
                <div className="cta-user-name">Sarthak Bagul</div>
                <div className="cta-user-status">
                  <span className="cta-user-status-dot" />
                  In code review
                </div>
              </div>
            </div>
            <div className="cta-user-bubble">
              <div className="cta-user-avatar cta-user-avatar-3">TZ_P</div>
              <div className="cta-user-info">
                <div className="cta-user-name">Prnav Harak</div>
                <div className="cta-user-status">
                  <span className="cta-user-status-dot" />
                  Debugging
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Features */}
          <motion.div
            className="cta-feature-tags"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="cta-feature-tag">
              <svg
                className="cta-feature-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <span className="cta-feature-text">Real-time sync</span>
            </div>
            <div className="cta-feature-tag">
              <svg
                className="cta-feature-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span className="cta-feature-text">AI-powered</span>
            </div>
            <div className="cta-feature-tag">
              <svg
                className="cta-feature-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span className="cta-feature-text">Enterprise secure</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <motion.button
        className="cta-button"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Start for free
        <svg
          className="cta-button-arrow"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </motion.button>

      <motion.div
        className="cta-footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <p className="cta-tagline">
          <span className="cta-brand">Devmet</span> — The Future of
          Collaborative Coding
        </p>
      </motion.div>
    </section>
  );
};
