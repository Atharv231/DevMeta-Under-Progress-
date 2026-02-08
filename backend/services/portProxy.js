// // 🆕 PURPOSE: Proxy container ports to browser

// import httpProxy from "http-proxy";

// const proxy = httpProxy.createProxyServer({ ws: true });

// export function setupPortProxy(app, io) {
//   app.use("/preview/:port", (req, res) => {
//     const port = req.params.port;

//     proxy.web(req, res, {
//       target: `http://localhost:${port}`,
//     });
//   });

//   io.on("connection", (socket) => {
//     socket.on("preview:port", (port) => {
//       socket.emit("preview:url", `/preview/${port}`);
//     });
//   });
// }
