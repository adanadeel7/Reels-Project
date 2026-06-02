import { User } from "../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()


const jwt_secret = process.env.JWT_SECRET
async function registerUser(req,res) {

    const {name, email, password} = req.body

    const isUserAlreadyExit = await User.findOne({
        email
    })
    
    if(isUserAlreadyExit){ 
        return res.status(400).json({ 
            message: "User already exists"
    })}
    
    const hashedPassword = await bcrypt.hash(password,10)
    const user = await User.create({
        name, 
        email, 
        password : hashedPassword
    })
    const token = jwt.sign({
        id: user._id

    },jwt_secret)

    res.cookie("token",token)

    res.status(201).json({
        message: "User registered Successfully",
        user : { 
            _id: user._id,
            email: user.email,
            name: user.name
        }
    })

}

async function loginUser() { 
    console.log("Hello")
}


export {registerUser,loginUser}