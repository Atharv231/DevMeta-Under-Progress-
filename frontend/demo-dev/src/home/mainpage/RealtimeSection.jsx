import { Code2 } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import CodeEditor from "./CodeEditor";
import "./experience-section.css";
import { useRef } from "react";
import GlowOrb from "./GlowOrb";
import "./RealtimeSection.css";
import useSmoothScroll from "./useSmoothScroll";

const codeLines = [
  "import { collaborate } from '@devmet/core';",
  "import { AI } from '@devmet/intelligence';",
  "",
  "const team = await devmet.createRoom();",
  "const members = ['alice', 'bob', 'charlie'];",
  "",
  "// Real-time sync across the globe",
  "team.sync({",
  "  cursors: true,",
  "  selections: true,",
  "  changes: 'instant'",
  "});",
  "",
  "// AI-powered assistance",
  "const suggestion = AI.optimize(code);",
  "AI.explain(complexFunction);",
];

const RealtimeSection = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  useSmoothScroll(true);
  return (
    <>
      <section className="realtime-section">
        <GlowOrb size={500} color="cyan" className="glow-orb-right" />

        <div className="container">
          <div className="grid">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="left-content"
            >
              <motion.div
                className="badge"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <Code2 className="badge-icon" />
                <span className="badge-text">Real-Time Editing</span>
              </motion.div>

              <h2 className="title">
                See Every <span className="gradient-text">Keystroke</span>{" "}
                Instantly
              </h2>

              <p className="description">
                Experience true real-time collaboration. Every character typed,
                every selection made, every cursor movement – synced instantly
                across all connected developers.
              </p>

              <ul className="feature-list">
                {[
                  "Millisecond-level synchronization",
                  "Conflict-free concurrent editing",
                  "Presence awareness with live cursors",
                  "Automatic session persistence",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    className="feature-item"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <span className="feature-dot" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <div className="experience-visual">
              <motion.div style={{ y: y1 }} className="editor">
                <div className="editor-header">
                  <div className="dots">
                    <span className="red" />
                    <span className="yellow" />
                    <span className="green" />
                  </div>
                  <span className="filename">collaborate.ts</span>
                </div>

                <div className="editor-body">
                  {codeLines.map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * index }}
                      className="code-line"
                    >
                      <span className="line-number">{index + 1}</span>
                      <span className="code-text">
                        {line.includes("//") ? (
                          <span className="comment">{line}</span>
                        ) : line.includes("import") ? (
                          <>
                            <span className="keyword">import</span>
                            {line.replace("import", "")}
                          </>
                        ) : line.includes("const") ? (
                          <>
                            <span className="keyword">const</span>
                            {line.replace("const", "")}
                          </>
                        ) : (
                          line
                        )}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="cursor"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RealtimeSection;
