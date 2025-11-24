import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import streamRoutes from "./routes/stream.routes.js";
import cors from "cors";
import { app, server } from "./lib/socket.js";



app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// CORS configuration - comprehensive setup
const allowedOrigins = [
  'https://whisppp.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean); // Remove any undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));

app.use(cookieParser());



app.use("/auth" , authRoutes);
app.use("/api" , messageRoutes);
app.use("/chat" , streamRoutes );





const PORT = process.env.PORT || 3000;

server.listen(PORT , ()=>{
    console.log(`App is running on ${PORT}`)
})

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("Mongo DB connected successfully")
})
.catch(()=>{
    console.log("Error in connecting to the database");
})