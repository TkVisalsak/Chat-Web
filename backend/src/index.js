import express from "express";
import dotenv from "dotenv";
import "./lib/google.js";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const PORT = process.env.PORT || 5001;

app.use(express.json());

app.use(cookieParser());

// Enable CORS **before** your routes
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// Use your auth routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Connect to DB and start the server
connectDB();
const HOST = '127.0.0.1'; // match this to your frontend host

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend/public")));

server.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
//Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
