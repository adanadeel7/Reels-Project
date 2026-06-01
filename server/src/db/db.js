import mongoose, { mongo } from "mongoose";

function connectDB(DATABASE_URL) { 
    try {
        mongoose.connect(DATABASE_URL)
        console.log("Database connected...")
    } catch (error) {
        console.log(error)
        
    }
}


export default connectDB