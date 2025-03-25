import express from "express";
import { createChat,getChats } from "../controllers/chat.controllers";
import { verifyJWT_username } from "../middlewares/verifyJWT.middleware";

const router=express.Router();
router.use(verifyJWT_email);

router.post("/",verifyJWT_username,createChat);
verify.get("/",verifyJWT_username,getChats);

export default router;