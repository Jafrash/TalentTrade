import express from "express";
import { sendMessage,getMessages } from "../controllers/message.controllers";
import { verifyJWT_username } from "../middlewares/verifyJWT.middleware";

const router=express.Router();


router.post("/sendMessage",verifyJWT_username,sendMessage);
router.get("/getMessages/:chatId",verifyJWT_username,getMessages);

export default router;