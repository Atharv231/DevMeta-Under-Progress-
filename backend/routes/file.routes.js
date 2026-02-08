import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const BASE_DIR = path.resolve("app");

// NOTE: Ensure workspace exists
if (!fs.existsSync(BASE_DIR)) fs.mkdirSync(BASE_DIR, { recursive: true });

// ================================
// LIST FILES
// ================================
router.get("/", (req, res) => {
  const files = fs.readdirSync(BASE_DIR);
  res.json(files);
});

// ================================
// CREATE FILE
// ================================
router.post("/create/:filename", (req, res) => {
  const safePath = path.join(BASE_DIR, req.params.filename);

  // NOTE: Prevent path traversal
  if (!safePath.startsWith(BASE_DIR)) {
    return res.status(403).json({ error: "Invalid path" });
  }

  if (fs.existsSync(safePath)) {
    return res.status(400).json({ error: "File already exists" });
  }

  fs.writeFileSync(safePath, "// New file\n");
  res.json({ message: "File created" });
});

// ================================
// READ FILE
// ================================
router.get("/:filename", (req, res) => {
  const safePath = path.join(BASE_DIR, req.params.filename);

  if (!safePath.startsWith(BASE_DIR)) {
    return res.status(403).json({ error: "Invalid path" });
  }

  const content = fs.existsSync(safePath)
    ? fs.readFileSync(safePath, "utf-8")
    : "";

  res.json({ content });
});

// ================================
// SAVE FILE
// ================================
router.post("/:filename", (req, res) => {
  const safePath = path.join(BASE_DIR, req.params.filename);

  if (!safePath.startsWith(BASE_DIR)) {
    return res.status(403).json({ error: "Invalid path" });
  }

  fs.writeFileSync(safePath, req.body.content);
  res.json({ message: "Saved" });
});

// ================================
// DELETE FILE  ✅ FIX
// ================================
router.delete("/:filename", (req, res) => {
  const filename = decodeURIComponent(req.params.filename).trim();

  const resolvedPath = path.resolve(BASE_DIR, filename);

  console.log("Filename:", JSON.stringify(filename));
  console.log("Resolved:", resolvedPath);

  if (!resolvedPath.startsWith(BASE_DIR)) {
    return res.status(403).json({ error: "Invalid path" });
  }

  if (!fs.existsSync(resolvedPath)) {
    return res.status(404).json({ error: "File not found" });
  }

  fs.unlinkSync(resolvedPath);
  res.json({ message: "File deleted" });
});

export default router;

// 🆕 PURPOSE: Proxy container ports to browser

import httpProxy from "http-proxy";

const proxy = httpProxy.createProxyServer({ ws: true });

export function setupPortProxy(app, io) {
  app.use("/preview/:port", (req, res) => {
    const port = req.params.port;

    proxy.web(req, res, {
      target: `http://localhost:${port}`,
    });
  });

  io.on("connection", (socket) => {
    socket.on("preview:port", (port) => {
      socket.emit("preview:url", `/preview/${port}`);
    });
  });
}
