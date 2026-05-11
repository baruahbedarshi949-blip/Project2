import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./config/db.js";

import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoutes.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

import "dotenv/config";

// APP CONFIG
const app = express();

const server = http.createServer(app);

// ALLOWED FRONTEND URLS
const allowedOrigins = [
  "https://project2-2-bae5.onrender.com", // Admin Panel
  "https://project2-1-tzsw.onrender.com", // Frontend Website
];

// SOCKET.IO CONFIG
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const port = process.env.PORT || 4000;

// MIDDLEWARES
app.use(express.json());

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// DATABASE CONNECTION
connectDB();

// SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

// API ROUTES
app.use("/api/food", foodRouter);

app.use("/images", express.static("uploads"));

app.use("/api/user", userRouter);

app.use("/api/cart", cartRouter);

app.use("/api/order", orderRouter);

// TEST ROUTE FOR SOCKET.IO
app.get("/notify", (req, res) => {
  io.emit("new_order", {
    message: "🔥 New Order Received!",
  });

  res.send("Notification Sent");
});

// ROOT ROUTE
app.get("/", (req, res) => {
  res.send("API Working");
});

// START SERVER
server.listen(port, () => {
  console.log(`Server Started on port: ${port}`);
});
