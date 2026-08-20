import mongoose from "mongoose";

const saveSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'foodItem',
        required: true
    }
}, {
    timestamps: true
})


const saveModel = mongoose.model('save', saveSchema); 

export default saveModel