import express from "express";
import { exec } from "child_process";
import path from "path";

const router = express.Router();
const BASE_DIR = path.resolve("app");

router.post("/", (req, res) => {
  const { filename } = req.body;

  if (!filename) {
    return res.status(400).json({ error: "Filename required" });
  }

  const filePath = path.join(BASE_DIR, filename);

  if (!filePath.startsWith(BASE_DIR)) {
    return res.status(403).json({ error: "Invalid path" });
  }

  let cmd = "";

  if (filename.endsWith(".js")) {
    cmd = `docker run --rm -v ${BASE_DIR}:/app -w /app node:20 node ${filename}`;
  } else if (filename.endsWith(".py")) {
    cmd = `docker run --rm -v ${BASE_DIR}:/app -w /app python:3.12 python ${filename}`;
  } else {
    return res.status(400).json({ error: "Unsupported file type" });
  }

  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      return res.json({ output: stderr || err.message });
    }
    res.json({ output: stdout });
  });
});

export default router;
