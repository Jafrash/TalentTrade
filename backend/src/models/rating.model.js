import mangoose,{Schema} from "mangoose";

const ratingSchema=new Schema({
    rating:{
        type:Number,
        required:true
    },
    rater:{
        type:Schema.Types.ObjectId,
        ref:true
    },
    description:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    }
},{timestamps:true});

export const Rating=mangoose.model("Rating",ratingSchema);