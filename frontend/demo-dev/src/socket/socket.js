import { io } from "socket.io-client";

const socket = io("https://devmeta-under-progress.onrender.com", {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
