import http from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import httpProxy from "http-proxy";

import setupTerminal from "./sockets/terminalSocket.js";
import fileRoutes from "./routes/file.routes.js";
import runRoute from "./routes/run.js";
// 🆕 PHASE 5.1
import { watchWorkspace } from "./services/fileWatcher.js";

const app = express();
const proxy = httpProxy.createProxyServer({}); // 🔴 REQUIRED

app.use(cors());
app.use(express.json());

app.use("/api/files", fileRoutes);
app.use("/api/run", runRoute);

// 🔴 APP PREVIEW PROXY
app.use("/preview/:port", (req, res) => {
  const port = req.params.port;
  proxy.web(req, res, {
    target: `http://localhost:${port}`,
  });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
  transports: ["websocket"], // 🔴 IMPORTANT
});

setupTerminal(io);

watchWorkspace(io, process.cwd());

server.listen(5000, () => {
  console.log("Backend + Terminal running on port 5000");
});
