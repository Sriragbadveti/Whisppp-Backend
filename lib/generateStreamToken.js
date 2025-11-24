import { serverClient } from "./stream.js";


export const generateStreamToken = async (userId, userData = null) => {
  try {
    // Validate serverClient is initialized
    if (!serverClient) {
      const errorMsg = "Stream Chat server client is not initialized. Please check STREAM_API_KEY and STREAM_SECRET environment variables.";
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    // Validate environment variables
    if (!process.env.STREAM_API_KEY || !process.env.STREAM_SECRET) {
      const errorMsg = "Stream Chat API key or secret is missing. Please add STREAM_API_KEY and STREAM_SECRET to your environment variables.";
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    if (!userId) {
      throw new Error("User ID is required to generate token");
    }
    
    const stringUserId = userId.toString();
    
    // Upsert user in Stream Chat first (if userData provided)
    if (userData) {
      try {
        await serverClient.upsertUser({
          id: stringUserId,
          name: userData.username || userData.name || 'User',
          image: userData.profilePic || userData.image || undefined,
        });
      } catch (upsertError) {
        // Continue even if upsert fails - token can still be generated
      }
    }
    
    // Generate token for the user
    const streamToken = serverClient.createToken(stringUserId);

    if (!streamToken) {
      throw new Error("Failed to generate stream token - createToken returned null/undefined");
    }

    return streamToken;
  } catch (error) {
    throw error;
  }
};


export const getStreamToken = async(req,res)=>{
  try {
    // Validate user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({message: "User not authenticated"});
    }

    // Pass user data to upsert user in Stream Chat before generating token
    const userData = {
      username: req.user.username,
      profilePic: req.user.profilePic,
      email: req.user.email
    };

    const streamToken = await generateStreamToken(req.user._id, userData);
    return res.status(200).json({streamToken});
  } catch (error) {
    const errorMessage = error.message || "Error in getting stream token";
    return res.status(500).json({
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
