// NOTE: Added by secondary ChatGPT account
// PURPOSE: Centralize workspace path so editor + docker stay in sync

import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE = path.join(__dirname, "../workspaces");

export function createWorkspace() {
  // NOTE: Ensures workspace base exists
  if (!fs.existsSync(BASE)) {
    fs.mkdirSync(BASE, { recursive: true });
  }

  // NOTE: Simple random workspace ID for now
  const id = "user-" + crypto.randomBytes(4).toString("hex");
  const workspacePath = path.join(BASE, id);

  fs.mkdirSync(workspacePath);

  // NOTE: Default file for editor + terminal
  fs.writeFileSync(
    path.join(workspacePath, "index.js"),
    "console.log('Hello from online IDE');\n",
  );

  return { id, workspacePath };
}
