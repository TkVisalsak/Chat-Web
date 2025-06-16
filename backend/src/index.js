import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";
import passport from "passport";
import "./lib/google.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const PORT = process.env.PORT || 5001;
const HOST = process.env.PORT ? "0.0.0.0" : "127.0.0.1";

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: ['http://127.0.0.1:5500' , 'http://127.0.0.1:5501'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// Use your auth routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend/public")));

// SPA fallback (optional, if you use SPA frontend)
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
// });

// Connect to DB and start the server
connectDB();






server.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
//Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
