import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import MonacoEditor from "../components/MonacoEditor";
import FileExplorer from "../components/FileExplorer";
import TerminalComponent from "../components/Terminal";

import { getFiles, getFile, createFile, deleteFile } from "../api/fileApi";
import socket from "../socket/socket";
import "./ChatRoom.css";

export default function Workspace() {
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);

  const [code, setCode] = useState("");

  const { roomId } = useParams();

  const [savedCode, setSavedCode] = useState("");
  const [dirty, setDirty] = useState(false);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [openTabs, setOpenTabs] = useState([]);

  const [users, setUsers] = useState([]);

  // 🆕 Sidebar state for collapse/expand
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 🆕 AUTO-SAVE TIMER
  const autosaveTimerRef = useRef(null);
  const switchingRef = useRef(false);

  // 🆕 FIX: prevent Monaco onChange during file load
  const isLoadingFileRef = useRef(false);

  const refreshFiles = () => {
    getFiles().then((res) => setFiles(res.data));
  };

  useEffect(() => {
    if (!roomId) return;

    socket.emit("join-room", {
      roomId,
      username: localStorage.getItem("username"),
      password: localStorage.getItem("password"),
    });
  }, [roomId]);

  useEffect(() => {
    const handleUserList = (userList) => {
      setUsers(userList || []);
    };

    socket.on("user-list", handleUserList);

    return () => {
      socket.off("user-list", handleUserList);
    };
  }, []);

  useEffect(() => {
    refreshFiles();
    loadFile("index.js");

    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handler);

    socket.on("preview:url", (url) => setPreviewUrl(url));

    return () => {
      window.removeEventListener("keydown", handler);
      socket.off("preview:url");
    };
  }, []);

  useEffect(() => {
    socket.on("joined", ({ text }) => {
      // 🔥 load room editor state
      setCode(text);
      setSavedCode(text);
    });

    return () => socket.off("joined");
  }, []);

  useEffect(() => {
    // ================================
    // 🧯 OLD / DISABLED — INVALID LOCATION
    // Reason:
    // - editorRef does NOT exist in Workspace
    // - isRemoteUpdateRef does NOT exist here
    // - MonacoEditor owns editor sync logic
    // ================================
    /*
  socket.on("editor:update", ({ content }) => {
    if (!editorRef.current) return;

    const model = editorRef.current.getModel();
    if (!model) return;

    isRemoteUpdateRef.current = true;
    model.setValue(content);
    isRemoteUpdateRef.current = false;
  });
  */

    return () => {
      socket.off("editor:update");
    };
  }, []);

  const loadFile = async (file) => {
    if (switchingRef.current) return;
    if (file === currentFile) return;

    switchingRef.current = true;

    isLoadingFileRef.current = true;

    setCurrentFile(file);
    setOpenTabs((t) => (t.includes(file) ? t : [...t, file]));

    const res = await getFile(file);
    const content = res.data.content;

    setCode(content);
    setSavedCode(content);
    setDirty(false);

    window.currentFile = file;
    window.currentCode = content;

    isLoadingFileRef.current = false;
    switchingRef.current = false;
  };

  const handleSave = () => {
    if (!currentFile) return;

    socket.emit("file:save", {
      filename: currentFile,
      content: code,
    });

    setSavedCode(code);
    setDirty(false);
  };

  const handleEditorChange = (value) => {
    if (isLoadingFileRef.current) return;

    setCode(value);
    setDirty(value !== savedCode);

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(() => {
      if (value !== savedCode && currentFile) {
        socket.emit("file:save", {
          filename: currentFile,
          content: value,
        });
        setSavedCode(value);
        setDirty(false);
      }
    }, 1500);
  };

  const handleCreate = async () => {
    const name = prompt("Enter filename");
    if (!name) return;

    await createFile(name);
    await refreshFiles();
    loadFile(name);
  };

  const handleDelete = async (file) => {
    await deleteFile(file);
    refreshFiles();
  };

  const handleRun = () => {
    if (!currentFile) return;
    socket.emit("run:file", { tabId: "main", name: currentFile });
  };

  const handleStop = () => {
    socket.emit("run:stop", { tabId: "main" });
  };

  const closeTab = (file, e) => {
    e.stopPropagation();
    setOpenTabs((tabs) => tabs.filter((t) => t !== file));
    if (currentFile === file && openTabs.length > 1) {
      const remaining = openTabs.filter((t) => t !== file);
      loadFile(remaining[remaining.length - 1]);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#1e1e1e",
        fontFamily: "'Segoe UI', 'SF Pro Text', -apple-system, sans-serif",
      }}
    >
      {/* Title Bar */}
      <div
        style={{
          height: "30px",
          background: "#323233",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid #1e1e1e",
          color: "#999999",
          fontSize: "12px",
          fontWeight: 500,
          WebkitAppRegion: "drag",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="6" height="6" fill="#0078d4" />
            <rect x="9" y="1" width="6" height="6" fill="#0078d4" />
            <rect x="1" y="9" width="6" height="6" fill="#0078d4" />
            <rect x="9" y="9" width="6" height="6" fill="#0078d4" />
          </svg>
          Code Editor — {currentFile || "No file open "}
        </span>
        <p className="chat-user-count ">
          <span className="chat-user-count-dot"></span>
          <span className="foreditor">
            {users.length} user{users.length !== 1 ? "s" : ""} online
          </span>
        </p>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* Activity Bar (Icon Sidebar) */}
        <div
          style={{
            width: "48px",
            background: "#252526",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "8px",
            gap: "4px",
            borderRight: "1px solid #1e1e1e",
          }}
        >
          {/* Files Icon */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: sidebarOpen ? "transparent" : "transparent",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
              borderLeft: sidebarOpen
                ? "2px solid #ffffff"
                : "2px solid transparent",
              marginLeft: "-2px",
              paddingLeft: "2px",
            }}
            title="Explorer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M17.5 0h-9L7 1.5V6H2.5L1 7.5v15.07L2.5 24h12.07L16 22.57V18h4.7l1.3-1.43V4.5L17.5 0zm0 2.12l2.38 2.38H17.5V2.12zm-3 20.38h-12v-15H7v9.07L8.5 18h6v4.5zm6-6h-12v-15H16V6h4.5v10.5z"
                fill={sidebarOpen ? "#ffffff" : "#858585"}
              />
            </svg>
          </button>

          {/* Search Icon */}
          <button
            style={{
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
            }}
            title="Search"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15.25 0a8.25 8.25 0 00-6.18 13.72L1 22.88l1.12 1.12 8.05-9.12A8.251 8.251 0 1015.25.01V0zm0 15a6.75 6.75 0 110-13.5 6.75 6.75 0 010 13.5z"
                fill="#858585"
              />
            </svg>
          </button>

          {/* Git Icon */}
          <button
            style={{
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
            }}
            title="Source Control"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M21.007 8.222A3.738 3.738 0 0015.045 5.2a3.737 3.737 0 00-2.783 5.107L8.138 13.9a3.738 3.738 0 00-5.357.397 3.738 3.738 0 105.357 5.159l4.124-3.593a3.737 3.737 0 005.962-1.962 3.738 3.738 0 002.783-5.679zM5.508 18.25a2.25 2.25 0 110-4.5 2.25 2.25 0 010 4.5zm5.617-5.99l4.124-3.593a3.738 3.738 0 001.961-.397l-4.124 3.593a3.738 3.738 0 00-1.961.397zm7.363-3.51a2.25 2.25 0 110-4.5 2.25 2.25 0 010 4.5z"
                fill="#858585"
              />
            </svg>
          </button>

          <div style={{ flex: 1 }}></div>

          {/* Settings Icon */}
          <button
            style={{
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
              marginBottom: "8px",
            }}
            title="Settings"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M19.85 8.75l4.15.83v4.84l-4.15.83 2.35 3.52-3.43 3.43-3.52-2.35-.83 4.15H9.58l-.83-4.15-3.52 2.35-3.43-3.43 2.35-3.52L0 11.42V6.58l4.15-.83L1.8 2.23 5.23 0l3.52 2.35L9.58 0h4.84l.83 4.15 3.52-2.35 3.43 3.43-2.35 3.52zM12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
                fill="#858585"
              />
            </svg>
          </button>
        </div>

        {/* File Explorer Sidebar */}
        <div
          style={{
            width: sidebarOpen ? "240px" : "0px",
            overflow: "hidden",
            transition: "width 0.15s ease",
            background: "#252526",
            borderRight: sidebarOpen ? "1px solid #1e1e1e" : "none",
          }}
        >
          <FileExplorer
            files={files}
            activeFile={currentFile}
            onSelect={loadFile}
            onCreate={handleCreate}
            onDelete={handleDelete}
            dirty={dirty}
          />
        </div>

        {/* Editor Area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          {/* Tabs Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#252526",
              height: "35px",
              borderBottom: "1px solid #1e1e1e",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                overflowX: "auto",
                flex: 1,
              }}
            >
              {openTabs.map((file) => (
                <div
                  key={file}
                  onClick={() => loadFile(file)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "0 12px",
                    height: "35px",
                    cursor: "pointer",
                    background: file === currentFile ? "#1e1e1e" : "#2d2d2d",
                    borderRight: "1px solid #1e1e1e",
                    fontSize: "13px",
                    color: file === currentFile ? "#ffffff" : "#969696",
                    transition: "background 0.1s ease",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    if (file !== currentFile) {
                      e.currentTarget.style.background = "#2a2a2a";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (file !== currentFile) {
                      e.currentTarget.style.background = "#2d2d2d";
                    }
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M13.5 3H8.914l-.707-.707A1 1 0 007.5 2H2.5a1 1 0 00-1 1v10a1 1 0 001 1h11a1 1 0 001-1V4a1 1 0 00-1-1z"
                      fill="#e8ab53"
                    />
                  </svg>
                  <span>{file}</span>
                  {dirty && file === currentFile && (
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        background: "#ffffff",
                        borderRadius: "50%",
                      }}
                    ></span>
                  )}
                  <button
                    onClick={(e) => closeTab(file, e)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#969696",
                      cursor: "pointer",
                      padding: "2px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "3px",
                      marginLeft: "4px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#5a5a5a";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 8.707l3.646 3.647.708-.708L8.707 8l3.647-3.646-.708-.708L8 7.293 4.354 3.646l-.708.708L7.293 8l-3.647 3.646.708.708L8 8.707z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Breadcrumb / Path */}
          <div
            style={{
              padding: "4px 16px",
              background: "#1e1e1e",
              fontSize: "12px",
              color: "#969696",
              borderBottom: "1px solid #2d2d2d",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span style={{ color: "#cccccc" }}>src</span>
            <span>›</span>
            <span style={{ color: "#cccccc" }}>{currentFile}</span>
          </div>

          {/* Toolbar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              background: "#1e1e1e",
              borderBottom: "1px solid #2d2d2d",
            }}
          >
            <button
              onClick={handleSave}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                background: dirty ? "#0e639c" : "#3c3c3c",
                border: "none",
                borderRadius: "4px",
                color: "#ffffff",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 500,
                transition: "background 0.1s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = dirty
                  ? "#1177bb"
                  : "#505050";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = dirty
                  ? "#0e639c"
                  : "#3c3c3c";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M13.354 1.354l1.292 1.292A.5.5 0 0115 3v10.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 011 13.5v-11A1.5 1.5 0 012.5 1H12a.5.5 0 01.354.146zM2 2.5v11a.5.5 0 00.5.5H4V10.5A1.5 1.5 0 015.5 9h5a1.5 1.5 0 011.5 1.5V14h1.5a.5.5 0 00.5-.5V3.207L12.793 2H2.5a.5.5 0 00-.5.5zm8 7.5h-4a.5.5 0 00-.5.5V14h5v-3.5a.5.5 0 00-.5-.5z"
                  fill="currentColor"
                />
              </svg>
              Save {dirty && "●"}
            </button>
            <button
              onClick={handleRun}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                background: "#2ea043",
                border: "none",
                borderRadius: "4px",
                color: "#ffffff",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 500,
                transition: "background 0.1s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#3fb950";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#2ea043";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 2l10 6-10 6V2z" fill="currentColor" />
              </svg>
              Run
            </button>
            <button
              onClick={handleStop}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                background: "#da3633",
                border: "none",
                borderRadius: "4px",
                color: "#ffffff",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 500,
                transition: "background 0.1s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f85149";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#da3633";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="3" y="3" width="10" height="10" fill="currentColor" />
              </svg>
              Stop
            </button>
          </div>

          {/* Editor + Preview Container */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            {/* Preview (if available) */}
            {previewUrl && (
              <div
                style={{
                  height: "280px",
                  borderBottom: "1px solid #2d2d2d",
                  background: "#1e1e1e",
                }}
              >
                <div
                  style={{
                    padding: "6px 12px",
                    background: "#252526",
                    fontSize: "11px",
                    color: "#969696",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    borderBottom: "1px solid #2d2d2d",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <circle
                      cx="8"
                      cy="8"
                      r="7"
                      stroke="#969696"
                      strokeWidth="1.5"
                    />
                    <circle cx="8" cy="8" r="3" fill="#969696" />
                  </svg>
                  Preview
                </div>
                <iframe
                  src={previewUrl}
                  title="App Preview"
                  style={{
                    height: "calc(100% - 32px)",
                    width: "100%",
                    border: "none",
                    background: "#ffffff",
                  }}
                />
              </div>
            )}

            {/* Monaco Editor */}
            <div style={{ flex: 1, minHeight: 0 }}>
              <MonacoEditor code={code} onChange={handleEditorChange} />
            </div>

            {/* Terminal */}
            <div style={{ height: "220px", minHeight: "220px" }}>
              <TerminalComponent />
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div
        style={{
          height: "22px",
          background: "#007acc",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          fontSize: "12px",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13zM7 4h2v5H7V4zm0 6h2v2H7v-2z"
                fill="currentColor"
              />
            </svg>
            {dirty ? "Modified" : "Saved"}
          </span>
          <span>JavaScript</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span>UTF-8</span>
          <span>LF</span>
          <span>Spaces: 2</span>
        </div>
      </div>
    </div>
  );
}
