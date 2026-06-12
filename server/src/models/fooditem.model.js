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
    }




},{timestamps:true})


const foodItem = mongoose.model("foodItem",foodSchema)

export default foodItem; 
