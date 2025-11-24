import { serverClient } from "./stream";


export const generateStreamToken = (userId) => {
  try {
    
    const stringUserId = userId.toString();
    const streamToken = serverClient.createToken(stringUserId);

    return streamToken;
  } catch (error) {
    throw error; // Fixed: throw error instead of res.error
  }
};


export const getStreamToken = async(req,res)=>{
  try {
    const streamToken = await generateStreamToken(req.user._id);
    return res.status(200).json({streamToken}) // Fixed: use streamToken variable instead of response
  } catch (error) {
    console.error("Error generating stream token:", error);
    return res.status(500).json({message:"Error in getting stream token"})
  }
}
