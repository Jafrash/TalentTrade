import mongoose,{Schema} from "mongoose";

const requestSchema = new Schema({
    sender:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiver:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:["Pending","Rejected","Connected"],
        default:"Pending"
    }
},{timestamps:true});

export const Request=mongoose.model("Request",requestSchema);