import express from "express";
import {ChangePin, CheckBalance, Deposit, Exit, Login, MiniStatement, signUp, Withdraw, getUserDetails, updateProfile} from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/signup",signUp);
router.post("/login",Login);

// Protected routes - require authentication
router.post("/balance", authMiddleware, CheckBalance);
router.post("/deposit",authMiddleware, Deposit);
router.post("/withdraw", authMiddleware, Withdraw);
router.post("/changepin", authMiddleware, ChangePin);
router.post("/ministatement", authMiddleware, MiniStatement)
router.post("/exit", authMiddleware, Exit)
router.post("/userdetails", authMiddleware, getUserDetails)
router.post("/updateprofile", authMiddleware, updateProfile)

export default router;
