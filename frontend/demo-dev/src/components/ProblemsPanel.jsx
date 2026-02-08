// ProblemsPanel.jsx
// 🆕 NEW FILE — Phase 6.2 Problems Panel

import React from "react";

export default function ProblemsPanel({ errors }) {
  if (!errors || errors.length === 0) {
    return (
      <div
        style={{
          padding: "12px 16px",
          color: "#4ec9b0",
          fontSize: "13px",
          fontFamily: "'Segoe UI', -apple-system, sans-serif",
          background: "#1e1e1e",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="#4ec9b0" strokeWidth="1.5" />
          <path
            d="M5.5 8l2 2 3-4"
            stroke="#4ec9b0"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        No problems detected
      </div>
    );
  }

  const handleClick = (err) => {
    // 🆕 NEW — dispatch global jump event
    window.dispatchEvent(
      new CustomEvent("editor:jump", {
        detail: {
          file: err.file,
          line: err.line,
          column: err.column,
        },
      }),
    );
  };

  return (
    <div
      style={{
        background: "#1e1e1e",
        color: "#cccccc",
        fontSize: "13px",
        fontFamily: "'Segoe UI', -apple-system, sans-serif",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "8px 16px",
          borderBottom: "1px solid #333333",
          fontSize: "11px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          color: "#bbbbbb",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span>Problems</span>
        <span
          style={{
            background: "#f14c4c",
            color: "#ffffff",
            borderRadius: "10px",
            padding: "1px 8px",
            fontSize: "10px",
            fontWeight: 600,
          }}
        >
          {errors.length}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {errors.map((err, i) => (
          <div
            key={i}
            onClick={() => handleClick(err)}
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              borderBottom: "1px solid #2d2d2d",
              transition: "background 0.1s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#2a2d2e";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                color: "#f14c4c",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                style={{ marginTop: "2px", flexShrink: 0 }}
              >
                <circle cx="8" cy="8" r="7" fill="#f14c4c" />
                <path
                  d="M8 4v5M8 11v1"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span style={{ color: "#d4d4d4" }}>{err.message}</span>
            </div>
            <div
              style={{
                marginTop: "4px",
                marginLeft: "22px",
                fontSize: "12px",
                color: "#808080",
              }}
            >
              {err.file}:{err.line}:{err.column}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
