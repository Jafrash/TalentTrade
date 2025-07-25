import express from "express";
import { createChat, getChats, sendMessage } from "../controllers/chat.controllers.js";
import { verifyJWT_username, verifyJWT_email } from "../middlewares/verifyJWT.middleware.js";

const router = express.Router();
router.use(verifyJWT_email);

router.post("/", verifyJWT_username, createChat);
router.get("/", verifyJWT_username, getChats);
router.post("/message", verifyJWT_username, sendMessage);

export default router;