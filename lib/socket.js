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
io.engine.on("connection_error", () => {
  // Socket connection error
});

const onlineUsers  = {};

export function getReceiverSocketId(receiverId){
    return onlineUsers[receiverId] || null;
}


io.on("connection" , (socket)=>{
    const userId = socket.userId;
    onlineUsers[userId] = socket.id;

    io.emit("getAllOnlineUsers" , Object.keys(onlineUsers));

    socket.on("disconnect" , ()=>{
        delete onlineUsers[userId];
        io.emit("getAllOnlineUsers" , Object.keys(onlineUsers));
    })

})


export {io,app,server};