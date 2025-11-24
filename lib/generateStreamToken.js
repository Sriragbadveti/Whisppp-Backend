import { serverClient } from "./stream.js";


export const generateStreamToken = (userId) => {
  try {
    // Validate serverClient is initialized
    if (!serverClient) {
      throw new Error("Stream Chat server client is not initialized");
    }

    // Validate environment variables
    if (!process.env.STREAM_API_KEY || !process.env.STREAM_SECRET) {
      throw new Error("Stream Chat API key or secret is missing");
    }

    if (!userId) {
      throw new Error("User ID is required to generate token");
    }
    
    const stringUserId = userId.toString();
    const streamToken = serverClient.createToken(stringUserId);

    if (!streamToken) {
      throw new Error("Failed to generate stream token");
    }

    return streamToken;
  } catch (error) {
    console.error("Error in generateStreamToken:", error);
    throw error;
  }
};


export const getStreamToken = async(req,res)=>{
  try {
    // Validate user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({message: "User not authenticated"});
    }

    const streamToken = await generateStreamToken(req.user._id);
    return res.status(200).json({streamToken});
  } catch (error) {
    console.error("Error generating stream token:", error);
    const errorMessage = error.message || "Error in getting stream token";
    return res.status(500).json({
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
