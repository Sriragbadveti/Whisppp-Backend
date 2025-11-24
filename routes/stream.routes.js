import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getStreamToken } from "../lib/generateStreamToken.js";
import { getStreamChatPartners } from "../lib/getStreamChannels.js";

const router = express.Router();

router.get("/stream-token" , authMiddleware , getStreamToken);

router.get("/chats", authMiddleware, async (req, res) => {
  try {
    const chatPartners = await getStreamChatPartners(req.user._id);
    return res.status(200).json(chatPartners);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching Stream Chat partners" });
  }
});

export default router;

