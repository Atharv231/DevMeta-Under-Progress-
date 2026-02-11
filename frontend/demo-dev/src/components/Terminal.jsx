import { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import socket from "../socket/socket";
import socket2 from "../socket/socket2";

export default function TerminalComponent() {
  const containerRef = useRef({});
  const termRef = useRef({});
  const fitRef = useRef({});

  const [tabs, setTabs] = useState(["main"]);
  const [currentTab, setCurrentTab] = useState("main");

  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    tabs.forEach((tabId) => {
      if (termRef.current[tabId]) return;

      requestAnimationFrame(() => {
        const el = containerRef.current[tabId];
        if (!el || termRef.current[tabId]) return;

        const term = new Terminal({
          cursorBlink: true,
          fontSize: 13,
          fontFamily:
            "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Consolas, monospace",
          theme: {
            background: "#0d1117",
            foreground: "#c9d1d9",
            cursor: "#58a6ff",
            cursorAccent: "#0d1117",
            selection: "#264f78",
            black: "#484f58",
            red: "#ff7b72",
            green: "#3fb950",
            yellow: "#d29922",
            blue: "#58a6ff",
            magenta: "#bc8cff",
            cyan: "#39c5cf",
            white: "#b1bac4",
          },
          lineHeight: 1.4,
          letterSpacing: 0,
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(el);
        fitAddon.fit();
        term.focus();

        term.write("\x1b[38;5;75m❯\x1b[0m Terminal connecting....\r\n");

        termRef.current[tabId] = term;
        fitRef.current[tabId] = fitAddon;

        socket2.emit("terminal:init", tabId);

        term.onData((data) => {
          socket2.emit("terminal:write", { tabId, data });
        });
      });
    });

    const handler = ({ tabId, data }) => {
      termRef.current[tabId]?.write(data);
    };

    socket2.on("terminal:data", handler);
    return () => socket2.off("terminal:data", handler);
  }, [tabs]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => {
          if (window.currentFile && window.currentCode) {
            socket2.emit("file:save", {
              filename: window.currentFile,
              content: window.currentCode,
            });
          }
        }, 300);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#0d1117",
        borderTop: "1px solid #21262d",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2px",
          padding: "0 8px",
          background: "#161b22",
          height: "35px",
          zIndex: 10,
          position: "relative",
          borderBottom: "1px solid #21262d",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginRight: "12px",
            color: "#8b949e",
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontFamily: "'Segoe UI', -apple-system, sans-serif",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <rect
              x="1"
              y="3"
              width="14"
              height="10"
              rx="1"
              stroke="#8b949e"
              strokeWidth="1.5"
            />
            <path
              d="M4 7l2 2-2 2M8 11h4"
              stroke="#8b949e"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Terminal
        </div>

        {tabs.map((tabId) => (
          <button
            key={tabId}
            onClick={() => setCurrentTab(tabId)}
            style={{
              fontWeight: tabId === currentTab ? "500" : "400",
              background: tabId === currentTab ? "#0d1117" : "transparent",
              border: "none",
              borderBottom:
                tabId === currentTab
                  ? "2px solid #58a6ff"
                  : "2px solid transparent",
              color: tabId === currentTab ? "#c9d1d9" : "#8b949e",
              padding: "8px 12px",
              cursor: "pointer",
              fontSize: "12px",
              fontFamily: "'Segoe UI', -apple-system, sans-serif",
              transition: "all 0.1s ease",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onMouseEnter={(e) => {
              if (tabId !== currentTab) {
                e.currentTarget.style.color = "#c9d1d9";
              }
            }}
            onMouseLeave={(e) => {
              if (tabId !== currentTab) {
                e.currentTarget.style.color = "#8b949e";
              }
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: tabId === currentTab ? "#3fb950" : "#484f58",
              }}
            ></span>
            {tabId}
          </button>
        ))}
        <button
          onClick={() => setTabs((t) => [...t, `term-${Date.now()}`])}
          style={{
            background: "transparent",
            border: "none",
            color: "#8b949e",
            cursor: "pointer",
            padding: "6px 10px",
            fontSize: "16px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.1s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#21262d";
            e.currentTarget.style.color = "#c9d1d9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#8b949e";
          }}
        >
          +
        </button>
      </div>

      <div style={{ flex: 1, position: "relative" }}>
        {tabs.map((tabId) => (
          <div
            key={tabId}
            ref={(el) => (containerRef.current[tabId] = el)}
            style={{
              position: "absolute",
              inset: 0,
              display: tabId === currentTab ? "block" : "none",
              background: "#0d1117",
              padding: "8px 12px",
            }}
          />
        ))}
      </div>
    </div>
  );
}
