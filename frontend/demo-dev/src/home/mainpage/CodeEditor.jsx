import { motion } from "framer-motion";
import LiveCursor from "./LiveCursor";
import "./CodeEditor.css";

const CodeEditor = () => {
  const codeLines = [
    {
      num: 1,
      content:
        '<span class="text-glow-violet">const</span> <span class="text-glow-cyan">collaborate</span> = <span class="text-glow-violet">async</span> () => {',
    },
    {
      num: 2,
      content:
        '  <span class="text-glow-violet">const</span> team = <span class="text-glow-violet">await</span> Devmet.<span class="text-glow-cyan">connect</span>();',
    },
    {
      num: 3,
      content:
        '  <span class="text-muted-foreground">// Real-time sync across all editors</span>',
    },
    {
      num: 4,
      content:
        '  team.<span class="text-glow-cyan">onCodeChange</span>(<span class="text-glow-violet">async</span> (delta) => {',
    },
    {
      num: 5,
      content:
        '    <span class="text-glow-violet">await</span> broadcast(delta);',
    },
    {
      num: 6,
      content:
        '    <span class="text-glow-violet">await</span> ai.<span class="text-glow-cyan">analyze</span>(delta);',
    },
    { num: 7, content: "  });" },
    { num: 8, content: "};" },
  ];

  return (
    <motion.div
      className="code-editor"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Header */}
      <div className="editor-header">
        <div className="window-controls">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
        </div>

        <span className="file-name">collaborate.ts</span>

        <div className="online-status">
          <span className="online-dot" />
          <span className="online-text">3 online</span>
        </div>
      </div>

      {/* Code area */}
      <div
        className="code-area"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {codeLines.map((line, i) => (
          <motion.div
            key={line.num}
            className="code-line"
            variants={{
              hidden: { opacity: 0, x: -20 },
              show: { opacity: 1, x: 0 },
            }}
          >
            <span className="line-number">{line.num}</span>
            <span dangerouslySetInnerHTML={{ __html: line.content }} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CodeEditor;
