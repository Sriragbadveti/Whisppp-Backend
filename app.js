import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import cors from "cors";
import { app, server } from "./lib/socket.js";



app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(cors({origin:process.env.CLIENT_URL , credentials:true}))
app.use(cookieParser());



app.use("/auth" , authRoutes);
app.use("/api" , messageRoutes);





server.listen(3000 , ()=>{
    console.log("App is running on 3000")
})

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("Mongo DB connected successfully")
})
.catch(()=>{
    console.log("Error in connecting to the database");
})