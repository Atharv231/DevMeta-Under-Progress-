import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import "./experience-section.css";

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

export const ExperienceSection = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section id="experience" ref={containerRef} className="experience-section">
      <div className="experience-bg" />

      <div className="experience-container">
        <div className="experience-grid">
          {/* LEFT */}
          <motion.div style={{ opacity }}>
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="experience-tag"
            >
              The Experience
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="experience-title"
            >
              Scrolling Through Devmet Feels Like{" "}
              <span className="text-gradient">Power</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="experience-text"
            >
              <p>As you scroll:</p>

              <ul>
                {[
                  "Code blocks assemble themselves",
                  "UI layers float in 3D space",
                  "Lines of logic connect like neural networks",
                  "Parallax depth gives a cinematic feel",
                  "Subtle micro-interactions reward every move",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <span className="dot" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="experience-footer"
            >
              <p className="italic">This is not a website.</p>
              <p className="bold">
                This is a{" "}
                <span className="primary">controlled digital experience</span>.
              </p>
            </motion.div>
          </motion.div>

          {/* RIGHT */}
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
  );
};

export default ExperienceSection;
