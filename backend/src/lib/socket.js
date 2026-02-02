import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5501",
  "http://localhost:5502",
  "http://127.0.0.1:5501",
  "http://127.0.0.1:5502",
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Listen for messages sent via socket from clients
  socket.on("sendMessage", (data) => {
    // data = { senderId, receiverId, text, image? }

    // Send new message to the receiver if connected
    const receiverSocketId = userSocketMap[data.receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", data);
    }

    // Also emit to the sender's socket (confirmation)
    io.to(socket.id).emit("newMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
