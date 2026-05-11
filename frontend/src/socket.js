import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected to Socket Server:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from Socket Server");
});

export default socket;