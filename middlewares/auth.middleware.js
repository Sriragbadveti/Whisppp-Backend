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
    const cookies = socket.handshake.headers.cookie;
    const token = cookies?.split("; ").find((row)=>row.startsWith("jwt="))?.split("=")[1];

    if(!token){
      return next(new Error("Unauthorized no token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if(!decoded){
      return next(new Error("Unauthorized invalid token"));
    }
  
    const user = await User.findById(decoded.userId).select("-password");
    if(!user){
      return next(new Error("User not found"));
    }

    socket.user = user;
    socket.userId = user._id.toString();

    next();

  } catch (error) {
    return next(new Error("Authentication failed"));
  }

}