import { io } from "socket.io-client";

const socket = io("https://project2-9t5s.onrender.com", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected to Socket Server:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from Socket Server");
});

export default socket;
