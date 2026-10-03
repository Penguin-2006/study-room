import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import Session from "./models/Session.js";
import Room from "./models/Room.js";
import User from "./models/User.js";
import jwt from "jsonwebtoken";

dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/sessions", sessionRoutes);

app.get("/", (req, res) => {
  res.send("Study Room API is running...");
});


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  
  socket.on("join-room", async ({ roomCode, token }) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      const room = await Room.findOne({ code: roomCode });

      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      socket.join(roomCode);
      socket.roomCode = roomCode;
      socket.user = user;

      
      const session = await Session.findOne({ room: room._id });
      if (session) {
        socket.emit("session-history", session.messages);
      }

      
      io.to(roomCode).emit("user-joined", { name: user.name });

      console.log(`${user.name} joined room ${roomCode}`);
    } catch (error) {
      socket.emit("error", { message: "Authentication failed" });
    }
  });

  
  socket.on("send-message", async ({ roomCode, message }) => {
    try {
      const room = await Room.findOne({ code: roomCode });
      if (!room) return;

      const session = await Session.findOne({ room: room._id });
      if (!session) return;

     
      const userMessage = {
        type: "user",
        content: message,
        sender: socket.user.name,
        timestamp: new Date()
      };

      session.messages.push(userMessage);
      await session.save();

      
      io.to(roomCode).emit("new-message", userMessage);

      
      const history = session.messages.slice(-20).map((msg) => ({
        role: msg.type === "user" ? "user" : "assistant",
        content: msg.content
      }));

      
      const completion = await groq.chat.completions.create({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: `You are a helpful study assistant for a group studying "${room.topic}". 
            Give clear, concise answers. Use examples where helpful.`
          },
          ...history
        ],
        max_tokens: 500
      });

      const aiResponse = completion.choices[0].message.content;

      
      const aiMessage = {
        type: "ai",
        content: aiResponse,
        sender: "AI Assistant",
        timestamp: new Date()
      };

      session.messages.push(aiMessage);
      await session.save();

      
      io.to(roomCode).emit("new-message", aiMessage);

    } catch (error) {
      console.error("Message error:", error);
      socket.emit("error", { message: "Failed to process message" });
    }
  });

  
  socket.on("disconnect", () => {
    if (socket.user && socket.roomCode) {
      io.to(socket.roomCode).emit("user-left", { name: socket.user.name });
    }
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));