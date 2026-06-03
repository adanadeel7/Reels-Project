import mongoose from "mongoose";

const foodPartnerSchema = new mongoose.Schema({
    name: {
        type: String, 
        required : true
    }, 

    email : { 
        type: String, 
        required : true
    }, 

    password : { 
        type: String, 
        required : true
    }
},{timestamps:true})

const foodPartner = mongoose.model("foodPartner", foodPartnerSchema)
export default foodPartner