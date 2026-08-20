import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
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

}, {timestamps : true})

const likeModel = mongoose.model('like', likeSchema);

export default likeModel