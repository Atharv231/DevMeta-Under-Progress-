import Editor from "@monaco-editor/react";
import { useRef, useEffect } from "react";
import * as monaco from "monaco-editor";
import socket from "../socket/socket";

export default function MonacoEditor({ code, onChange }) {
  const editorRef = useRef(null);
  const monacoRef = useRef(monaco);
  const isRemoteUpdateRef = useRef(false);

  useEffect(() => {
    socket.on("editor:error", ({ line, column, message }) => {
      if (!editorRef.current) return;

      const editor = editorRef.current;
      const model = editor.getModel();
      if (!model) return;

      monaco.editor.setModelMarkers(model, "runtime", [
        {
          startLineNumber: line,
          startColumn: column || 1,
          endLineNumber: line,
          endColumn: (column || 1) + 1,
          message,
          severity: monaco.MarkerSeverity.Error,
        },
      ]);

      editor.setPosition({ lineNumber: line, column: column || 1 });
      editor.revealLineInCenter(line);
      editor.focus();
    });

    // ================================
    // 🔁 RECEIVE REMOTE EDITOR UPDATES
    // ================================
    socket.on("editor:update", ({ content }) => {
      if (!editorRef.current) return;

      const model = editorRef.current.getModel();
      if (!model) return;

      isRemoteUpdateRef.current = true;
      model.setValue(content);
      isRemoteUpdateRef.current = false;
    });

    return () => {
      socket.off("editor:error");
      socket.off("editor:update");
    };
  }, []);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        background: "#1e1e1e",
      }}
    >
      <Editor
        height="100%"
        language="javascript"
        theme="vs-dark"
        value={code}
        onChange={(value) => {
          if (isRemoteUpdateRef.current) return;

          onChange(value); // Workspace state update

          socket.emit("editor:update", {
            content: value,
          });
        }}
        onMount={(editor) => {
          editorRef.current = editor;
        }}
        options={{
          fontSize: 14,
          fontFamily:
            "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Consolas, monospace",
          minimap: { enabled: true, scale: 1, showSlider: "mouseover" },
          automaticLayout: true,
          lineNumbers: "on",
          renderLineHighlight: "all",
          scrollBeyondLastLine: false,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          padding: { top: 10, bottom: 10 },
          folding: true,
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true,
          },
        }}
      />
    </div>
  );
}
