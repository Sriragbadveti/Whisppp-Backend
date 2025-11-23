import {Server} from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
import { socketAuthMiddleware } from "../middlewares/auth.middleware.js";
dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new Server(server , {

    cors:{
        origin:process.env.CLIENT_URL,
        credentials:true
    }
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