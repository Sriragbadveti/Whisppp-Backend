import express from "express";
import {signupController , loginController, logoutController, updateProfileController} from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection);

router.post("/sign-up" , signupController);
router.post("/login" , loginController);
router.post("/logout" , logoutController);
router.put("/update-profile" , authMiddleware , updateProfileController);
router.get("/check" , authMiddleware , (req,res)=>res.status(200).json(req.user));


export default router;