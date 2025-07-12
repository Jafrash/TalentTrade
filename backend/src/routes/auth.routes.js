import { Router } from "express";
import { googleAuthCallBack, googleAuthHandler, handleGoogleLoginCallBack, handleLogout, manualLogin, refreshToken, register } from "../controllers/auth.controllers.js";

const router = Router();
router.get("/google", googleAuthHandler);
router.get("/google/callback", googleAuthCallBack, handleGoogleLoginCallBack);
router.get("/logout", handleLogout);
router.post("/login", manualLogin);
router.get("/refresh-token", refreshToken);
router.post("/register", register);

export default router;
