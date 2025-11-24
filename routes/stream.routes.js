import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getStreamToken } from "../lib/generateStreamToken.js";

const router = express.Router();

router.get("/stream-token" , authMiddleware , getStreamToken)


export default router;

