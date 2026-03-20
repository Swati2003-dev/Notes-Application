import express from "express";
import { signin, signout, signup, forgotPassword, resetPassword } from "../controller/auth.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
export default router;
