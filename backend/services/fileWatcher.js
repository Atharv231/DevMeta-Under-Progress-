// services/fileWatcher.js
// ================================
// 🆕 PHASE 5.1 — FILE SYSTEM WATCHER
// ================================

import fs from "fs";
import path from "path";

export function watchWorkspace(io, workspacePath) {
  // ✅ Ensure path exists
  if (!fs.existsSync(workspacePath)) return;

  // 🛡 Prevent duplicate watchers
  if (global.__workspaceWatcher) return;
  global.__workspaceWatcher = true;

  // 👀 Watch for file changes
  fs.watch(workspacePath, { recursive: true }, (eventType, filename) => {
    if (!filename) return;

    // 🚫 Ignore temp/system files
    if (
      filename.includes("node_modules") ||
      filename.startsWith(".") ||
      filename.endsWith(".swp")
    )
      return;

    // 🔔 Notify all clients
    io.emit("fs:changed", {
      event: eventType,
      file: filename,
    });
  });
}
