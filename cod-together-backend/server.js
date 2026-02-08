// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "*" },
// });

// // rooms = {
// //   roomId: {
// //     password,
// //     editorContent,
// //     userCount,
// //   },
// // };
// const rooms = {};

// io.on("connection", (socket) => {
//   // ==============================
//   // CREATE ROOM
//   // ==============================
//   socket.on("create-room", ({ roomId, password }) => {
//     if (rooms[roomId]) {
//       socket.emit("error", "Room already exists");
//       return;
//     }

//     rooms[roomId] = {
//       password,
//       editorContent: "", // ✅ editor state
//       userCount: 1,
//     };

//     socket.userName = "User-" + rooms[roomId].userCount;
//     socket.roomId = roomId;

//     socket.join(roomId);

//     socket.emit("joined", {
//       editorContent: rooms[roomId].editorContent,
//       userName: socket.userName,
//     });
//   });

//   // ==============================
//   // JOIN ROOM
//   // ==============================
//   socket.on("join-room", ({ roomId, password }) => {
//     if (!rooms[roomId] || rooms[roomId].password !== password) {
//       socket.emit("error", "Invalid Room ID or Password");
//       return;
//     }

//     rooms[roomId].userCount += 1;
//     socket.userName = "User-" + rooms[roomId].userCount;
//     socket.roomId = roomId;

//     socket.join(roomId);

//     socket.emit("joined", {
//       editorContent: rooms[roomId].editorContent,
//       userName: socket.userName,
//     });
//   });

//   // ==============================
//   // 📝 SHARED EDITOR (MODE C)
//   // ==============================
//   socket.on("editor:update", ({ content }) => {
//     const roomId = socket.roomId;
//     if (!roomId || !rooms[roomId]) return;

//     // ✅ save editor content
//     rooms[roomId].editorContent = content;

//     // ✅ broadcast to everyone else in the room
//     socket.to(roomId).emit("editor:update", {
//       content,
//     });
//   });

//   socket.on("disconnect", () => {
//     // optional cleanup later
//   });
// });

// server.listen(3000, () => {
//   console.log("Server running on http://localhost:3000");
// });

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// rooms = {
//   roomId: {
//     password,
//     editorContent,
//     userCount,
//     users,          // 🆕 NEW (chat user list)
//   },
// };
const rooms = {};
const socketUsers = {}; // 🆕 socket.id -> username

io.on("connection", (socket) => {
  // ==============================
  // CREATE ROOM
  // ==============================
  socket.on("create-room", ({ roomId, password, username }) => {
    if (rooms[roomId]) {
      socket.emit("error", "Room already exists");
      return;
    }

    rooms[roomId] = {
      password,
      editorContent: "", // ✅ existing editor state
      userCount: 1, // ✅ existing logic
      users: [], // 🆕 NEW for chat
    };

    // ✅ existing username logic (kept)
    socket.userName = username || "User-" + rooms[roomId].userCount; // 🆕 username support
    socketUsers[socket.id] = socket.userName; // 🆕 bind username to socket

    socket.roomId = roomId;

    rooms[roomId].users.push(socket.userName); // 🆕 add user to chat list

    socket.join(roomId);

    socket.emit("joined", {
      roomId, // 🆕 added (needed by frontend redirect)
      editorContent: rooms[roomId].editorContent,
      userName: socket.userName,
    });

    io.to(roomId).emit("user-list", rooms[roomId].users); // 🆕 chat users
  });

  // ==============================
  // JOIN ROOM
  // ==============================
  socket.on("join-room", ({ roomId, password, username }) => {
    if (!rooms[roomId] || rooms[roomId].password !== password) {
      socket.emit("error", "Invalid Room ID or Password");
      return;
    }

    rooms[roomId].userCount += 1;

    // ✅ existing logic + username support
    socket.userName = username || "User-" + rooms[roomId].userCount; // 🆕
    socketUsers[socket.id] = socket.userName; // 🆕

    socket.roomId = roomId;

    if (!rooms[roomId].users.includes(socket.userName)) {
      rooms[roomId].users.push(socket.userName); // 🆕
    }

    socket.join(roomId);

    socket.emit("joined", {
      roomId, // 🆕 added
      editorContent: rooms[roomId].editorContent,
      userName: socket.userName,
    });

    io.to(roomId).emit("user-list", rooms[roomId].users); // 🆕
  });

  // ==============================
  // 📝 SHARED EDITOR (UNCHANGED)
  // ==============================
  socket.on("editor:update", ({ content }) => {
    const roomId = socket.roomId;
    if (!roomId || !rooms[roomId]) return;

    rooms[roomId].editorContent = content;

    socket.to(roomId).emit("editor:update", {
      content,
    });
  });

  // ==============================
  // 💬 CHAT MESSAGE (🆕 NEW)
  // ==============================
  socket.on("send-message", ({ text, username }) => {
    const roomId = socket.roomId;
    if (!roomId || !rooms[roomId]) return;

    // 🆕 FORCE correct username from socket map
    const safeUsername = socketUsers[socket.id];

    io.to(roomId).emit("message", {
      id: Date.now(),
      username: safeUsername, // ✅ ALWAYS correct
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  });

  // ==============================
  // 🚪 DISCONNECT (🆕 chat cleanup)
  // ==============================
  socket.on("disconnect", () => {
    const roomId = socket.roomId;
    const username = socket.userName;

    if (roomId && rooms[roomId] && username) {
      rooms[roomId].users = rooms[roomId].users.filter((u) => u !== username);

      io.to(roomId).emit("user-list", rooms[roomId].users);
    }
  });
});

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
