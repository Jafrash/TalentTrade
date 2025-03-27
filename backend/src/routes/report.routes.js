import { createReport } from "../controllers/report.controllers";
import {verifyJWT_username} from "../middlewares/verifyJWT.middleware.js";
import express from "express";

const router=express.Router();

router.post("/create",verifyJWT_username,createReport);

export default router;