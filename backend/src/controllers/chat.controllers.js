import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Chat} from "../models/chat.model.js";
import { UnRegisteredUser } from "../models/unRegisteredUser.model.js";
import { generateJWTToken_username } from "../utils/generateJWTtoken.js";

export const createChat=asyncHandler(async (req,res)=>{
    console.log("\n******** Inside CreateChat *********\n");
    const {users}=req.body
    console.log(users);
    if(users.length==0){
        throw new ApiError(400,"Please provide all the details")
    }

    const chat=await Chat.create({
        users:users
    })

    if(!chat){
        throw new ApiError(500,"Error creating chat");
    }

    res.status(200).json(new ApiResponse(200,"Chat created Successfully",chat));
})

export const getChats=asyncHandler(async (req,res)=>{
    console.log("\n******** Inside getChats *********\n");
    const userId=req.user._id;
    console.log(userId);

    const chats=await Chat.find({users:userId})
    .populate("users")
    .populate("latestMessage")
    .sort({updatedAt:-1});

    if(!chats){
        throw new ApiError(500,"Error fetching chats");
    }

    return res.status(200).json(new ApiResponse(200,"Chats fetched Successfully",chats));


})