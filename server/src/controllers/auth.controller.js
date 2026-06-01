import { User } from "../models/user.model";


async function registerUser(req,res) {

    const {name, email, password} = req.body

    const isUserAlreadyExit = await userModel.findOne({
        email
    })
    
    if(isUserAlreadyExit){ 
        return res.status(400).json({ 
            message: "User already exists"
        })
    }
}