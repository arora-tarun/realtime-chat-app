import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config({ path: path.resolve("../.env") }); // load .env

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Online users tracking
let onlineUsers = {};

// Socket.io
io.on("connection", (socket) => {
  console.log("⚡ New user connected:", socket.id);

  // Register user as online
  socket.on("newUser", (email) => {
    onlineUsers[email] = socket.id;
    io.emit("onlineUsers", Object.keys(onlineUsers));
  });

  // Handle private messages
  socket.on("sendMessage", (data) => {
    const receiverSocket = onlineUsers[data.receiver];
    if (receiverSocket) {
      io.to(receiverSocket).emit("receiveMessage", data);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    for (let email in onlineUsers) {
      if (onlineUsers[email] === socket.id) {
        delete onlineUsers[email];
        break;
      }
    }
    io.emit("onlineUsers", Object.keys(onlineUsers));
    console.log("❌ User disconnected:", socket.id);
  });
});

// MongoDB + Server Start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("❌ DB Connection Error:", err));
