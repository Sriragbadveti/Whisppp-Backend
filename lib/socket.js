import {Server} from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
import { socketAuthMiddleware } from "../middlewares/auth.middleware.js";
dotenv.config();
const app = express();
const server = http.createServer(app);

// Socket.IO CORS configuration
const allowedOrigins = [
  'https://whisppp.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

console.log('Socket.IO allowed origins:', allowedOrigins);

const io = new Server(server , {
    cors:{
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Content-Type', 'Authorization']
    },
    allowEIO3: true // Allow Engine.IO v3 clients
})


io.use(socketAuthMiddleware);

// Handle connection errors
io.engine.on("connection_error", (err) => {
  console.log("Socket connection error:", err.req);
  console.log("Error code:", err.code);
  console.log("Error message:", err.message);
  console.log("Error context:", err.context);
});

const onlineUsers  = {};

export function getReceiverSocketId(receiverId){
    return onlineUsers[receiverId] || null;
}


io.on("connection" , (socket)=>{
    console.log("✅ A new user has connected:", socket.user?.username || "Unknown");
    const userId = socket.userId;
    onlineUsers[userId] = socket.id;

    console.log("Online users:", Object.keys(onlineUsers));
    io.emit("getAllOnlineUsers" , Object.keys(onlineUsers));

    socket.on("disconnect" , ()=>{
        console.log("❌ A user has disconnected:", socket.user?.username || "Unknown");
        delete onlineUsers[userId];
        io.emit("getAllOnlineUsers" , Object.keys(onlineUsers));
    })

})


export {io,app,server};