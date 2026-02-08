// NOTE: Added by secondary ChatGPT account
// PURPOSE: Mount same "files" directory used by File API

import Docker from "dockerode";
import path from "path";
import dotenv from "dotenv"; // 🔴 NEW
dotenv.config(); // 🔴 NEW
const docker = new Docker({
  socketPath: "//./pipe/docker_engine",
});

export async function createNodeContainer() {
  const filesPath = path.resolve("app");

  return await docker.createContainer({
    Image: "online-ide-node:latest",
    Cmd: ["bash"],
    Tty: true,
    OpenStdin: true,
    WorkingDir: "/app",
    Env: Object.entries(process.env).map(([key, value]) => `${key}=${value}`), // 🔴 NEW
    // 🆕 SECURITY LIMITS
    HostConfig: {
      Binds: [`${filesPath}:/app`],
      Memory: 512 * 1024 * 1024, // 🆕 512MB RAM
      NanoCpus: 1e9, // 🆕 1 CPU
      PidsLimit: 64, // 🆕 Prevent fork bombs
      NetworkMode: "none", // 🆕 Disable internet
    },
  });
}
