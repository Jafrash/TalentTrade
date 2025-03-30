import { Router } from "express";
import { googleAuthCallBack,googleAuthHandler,handleGoogleLoginCallBack,handleLogout } from "../controllers/auth.controllers.js";

const router=Router();
router.get("/google",googleAuthHandler);
router.get("/google/callback",googleAuthCallBack,handleGoogleLoginCallBack);
router.get("/logout",handleLogout);

export default router;
