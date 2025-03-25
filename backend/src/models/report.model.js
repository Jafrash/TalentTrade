import mongoose,{Schema} from "mongoose";

const reportSchema=new Schema({
    reporter:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    reported:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    nature:{
        type: String,
      enum: ["Personal conduct", "Professional expertise", "Others"],
    },
    description:{
        type:String,
        required:true
    }
},{timestamps:true})

export const Report=mongoose.model("Report",reportSchema);