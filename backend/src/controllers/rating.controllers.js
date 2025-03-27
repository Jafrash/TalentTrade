import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";
import {Rating} from "../models/rating.model.js"

export const rateUser=asyncHandler(async (req,res)=>{
    console.log("\n******** Inside createRating function *********\n");
    const {rating,description,username}=req.body;
    if(!rating || !description || !username){
        throw new ApiError(400,"Please provide all the details");
    }

    const user=await User.findOne({username:username});
    if(!user){
        throw new ApiError(400,"User not found");
    }

    const rateGiver=req.user._id;

    console.log("rateGiver: ",rateGiver);
    console.log("user:",user);

    const chat=await Chat.findOne({
        users:{$all:[rateGiver,user._id]}
        });

        if(!chat){
            throw new ApiError(400,"Please connect first to rate the user");
        }

        const rateExist=await Rating.findOne({
            rater:rateGiver,
            username:username
        })

        console.log("rateExist: ",rateExist);

        if(rateExist){
            throw new ApiError(400,"You have already rated the user");
        }

        var rate = await Rating.create({
            rating:rating,
            description:description,
            username:username,
            rater:rateGiver
        })

        if(!rate){
            throw new ApiError(500,"Error rating the user");
        }

        const ratings = await Rating.find({username:username});

        let sum=0;
        ratings.forEach((r)=>{
            sum+=r.rating;
        });

        const avgRating=sum/ratings.length;

        console.log("avgRating: ",avgRating);

        await User.findOneAndUpdate(
            {id:user._id},
            {
                rating:avgRating
            }
        )

        return res.status(200).json(new ApiResponse(200,rate,"Rating added successfully"))

})