// setupTerminal.js
// ================== IMPORTS ==================
import pty from "node-pty";
import path from "path";
import fs from "fs";
import { createNodeContainer } from "../services/dockerService.js";

// ================== MAIN FUNCTION ==================
export default function setupTerminal(io) {
  io.on("connection", async (socket) => {
    // 🟢 EXISTING: create & start container
    const container = await createNodeContainer();
    await container.start();

    // 🟢 EXISTING: store terminals
    const terminals = new Map();

    // =================================================
    // 🆕 PHASE 6 — Language Runner Map (NEW)
    // =================================================
    const languageRunners = {
      ".js": (f) => `node ${f}`,
      ".ts": (f) => `ts-node ${f}`,
      ".py": (f) => `python ${f}`,
      ".sh": (f) => `bash ${f}`,
      ".c": (f) => `gcc ${f} && ./a.out`,
      ".cpp": (f) => `g++ ${f} && ./a.out`,
      ".go": (f) => `go run ${f}`,
      ".rb": (f) => `ruby ${f}`,
      ".php": (f) => `php ${f}`,
      ".rs": (f) => `rustc ${f} && ./${path.basename(f, ".rs")}`,
      ".java": (f) => {
        const cls = path.basename(f, ".java");
        return `javac ${f} && java ${cls}`;
      },
    };

    // =================================================
    // 🆕 PHASE 5.2 — Parse runtime errors (UNCHANGED)
    // =================================================
    function parseRuntimeError(output) {
      const match = output.match(/:(\d+):(\d+)/);
      if (!match) return null;

      return {
        line: Number(match[1]),
        column: Number(match[2]),
        message: output.split("\n")[0],
      };
    }

    // =================================================
    // 🟢 EXISTING: create terminal per tab
    // =================================================
    function createTerminal(tabId) {
      if (terminals.has(tabId)) return terminals.get(tabId);

      const term = pty.spawn("docker", ["exec", "-it", container.id, "bash"], {
        name: "xterm-color",
        cols: 80,
        rows: 24,
        env: process.env,
      });

      term.on("data", (data) => {
        const text = data.toString();

        socket.emit("terminal:data", {
          tabId,
          data: text,
        });

        const error = parseRuntimeError(text);
        if (error) {
          socket.emit("editor:error", error);
        }
      });

      terminals.set(tabId, term);
      return term;
    }

    // 🟢 EXISTING
    createTerminal("main");

    socket.on("terminal:init", (tabId) => {
      createTerminal(tabId);
    });

    socket.on("terminal:write", ({ tabId, data }) => {
      const term = terminals.get(tabId);
      if (term) term.write(data);
    });

    // ================== FILE SAVE ==================
    socket.on("file:save", ({ filename, content }) => {
      try {
        if (typeof filename !== "string") return;

        const safeBase = path.resolve("app");
        const safePath = path.resolve("app", filename);
        if (!safePath.startsWith(safeBase)) return;

        fs.writeFileSync(safePath, content);

        socket.emit("terminal:data", {
          tabId: "main",
          data: "💾 Saved\n",
        });
      } catch {
        socket.emit("terminal:data", {
          tabId: "main",
          data: "❌ Save failed\n",
        });
      }
    });

    // ================== RUN FILE (UPGRADED) ==================
    socket.on("run:file", ({ tabId, name }) => {
      const term = terminals.get(tabId);
      if (!term || !name) return;

      term.write("\x1b[2J\x1b[H");

      const ext = path.extname(name);
      const runner = languageRunners[ext];

      if (!runner) {
        term.write(`❌ Unsupported language: ${ext}\n`);
        return;
      }

      term.write(`▶ Running ${name}\n`);
      term.write(`${runner(name)}\n`);
    });

    // ================== STOP ==================
    socket.on("run:stop", ({ tabId }) => {
      const term = terminals.get(tabId);
      if (!term) return;

      term.write("\x03");
      socket.emit("terminal:data", {
        tabId,
        data: "\n🛑 Process stopped\n",
      });
    });

    // ================== CLEANUP ==================
    socket.on("disconnect", async () => {
      terminals.forEach((t) => t.kill());
      try {
        await container.stop();
      } catch {}
    });
  });
}
