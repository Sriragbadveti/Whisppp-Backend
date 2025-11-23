import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import User from "../database/user.schema.js";


export async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(400).json({ message: "Missing token" });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    const validUser = await User.findById(verifyToken.userId);
    if (!validUser) {
      return res.status(400).json({ message: "User not found" });
    }

    req.user = validUser;
    next();
  } catch (error) {
    // Handle JWT-specific errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }
    // Handle other errors
    return res.status(401).json({ message: "Authentication failed" });
  }
}


export async function socketAuthMiddleware(socket, next) {
  try {
    console.log("Socket connection attempt - checking authentication...");
    
    const cookies = socket.handshake.headers.cookie;
    console.log("Cookies received:", cookies);
    
    const token = cookies?.split("; ").find((row)=>row.startsWith("jwt="))?.split("=")[1];

    if(!token){
      console.log("Socket connection rejected: No token provided");
      return next(new Error("Unauthorized no token provided"));
    }

    console.log("Token found, verifying...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if(!decoded){
      console.log("Socket connection rejected: Invalid token");
      return next(new Error("Unauthorized invalid token"));
    }
  
    const user = await User.findById(decoded.userId).select("-password");
    if(!user){
      console.log("Socket connection rejected: User not found");
      return next(new Error("User not found"));
    }

    socket.user = user;
    socket.userId = user._id.toString();

    console.log(`✅ Socket authenticated successfully for user: ${user.username}`);
    next();

  } catch (error) {
    console.log("❌ Socket authentication error:", error.message);
    return next(new Error("Authentication failed"));
  }

}