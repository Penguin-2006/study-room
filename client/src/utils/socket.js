import { io } from "socket.io-client";

const socket = io("https://study-room-server-4c0f.onrender.com", {
  autoConnect: false
});

export default socket;