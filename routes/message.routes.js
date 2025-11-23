import { getAllContacts, getChatPartners, getMessagesByUserId, sendMessage } from "../controllers/message.controllers.js";
import express from "express";
import {authMiddleware} from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/contacts" , authMiddleware , getAllContacts);
router.get("/chats" , authMiddleware , getChatPartners);
router.get("/:id" , authMiddleware , getMessagesByUserId);
router.post("/send/:id" , authMiddleware , sendMessage);

export default router;