import express from 'express';
import {rateUser} from "../models/rating.model.js"
import {verifyJWT_username} from "../middlewares/verifyJWT.middleware.js";

const router=express.Router();

router.post("/rateUser",verifyJWT_username,rateUser);