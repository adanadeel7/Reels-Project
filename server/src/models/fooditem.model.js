import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name : { 
        type : String, 
        required : true, 
        lowercase: true
    }, 

    video: { 
        type: String, 
        required: true, 
    }, 

    description: { 
        type: String,
    }, 

    foodPartner: { 
        type:mongoose.Schema.Types.ObjectId, 
        ref:"foodPartner"
    }, 

    likeCount : { 
        type : Number, 
        default : 0
    }, 
    savesCount : {
        type:Number, 
        default : 0
    }




},{timestamps:true})


const foodItem = mongoose.model("foodItem",foodSchema)

export default foodItem; 
