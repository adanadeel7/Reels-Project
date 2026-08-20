import { User } from "../models/user.model.js";
import foodPartner from "../models/foodpartner.model.js";
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

    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" })

    res.status(201).json({
        message: "User registered Successfully",
        user : { 
            _id: user._id,
            email: user.email,
            name: user.name
        }
    })

}

async function loginUser(req,res) {
    const {email, password} = req.body

    const user = await User.findOne({
        email
    })


    if (!user) { 
        return res.status(400).json({
            message : "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) { 
        return res.status(400).json({
            message : "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id:user._id
    },jwt_secret)
    
    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" })
    
    res.status(200).json({
        message: "User Login Successfully",
        user : { 
            _id: user._id,
            email: user.email,
            name: user.name
        }
    })
}

async function logoutUser(req,res) { 
    res.clearCookie("token")
    res.status(200).json({
        message: " User Successfully Logged out"
    })
} 

async function registerFoodPartner(req,res) {
     const {name, email, password, contactName, phone, address} = req.body

     if (!name || !email || !password || !contactName || !phone || !address) {
         return res.status(400).json({ message: "All fields are required" })
     }

    const isfoodPartnerAlreadyExit = await foodPartner.findOne({
        email
    })
    
    if(isfoodPartnerAlreadyExit){ 
        return res.status(400).json({ 
            message: "Food Partner already exists"
    })}
    
    const hashedPassword = await bcrypt.hash(password,10)
    const food = await foodPartner.create({
        name, 
        email, 
        password : hashedPassword,
        contactName,
        phone,
        address
    })
    const token = jwt.sign({
        id: food._id

    },jwt_secret)

    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" })

    res.status(201).json({
        message: "Food Partner registered Successfully",
        food : { 
            _id: food._id,
            email: food.email,
            name: food.name
        }
    })
}

async function loginFoodPartner(req,res){ 
    const {email, password} = req.body

    const food = await foodPartner.findOne({
        email
    })


    if (!food) { 
        return res.status(400).json({
            message : "Invalid email or password"
        })
    }

    const isFoodPasswordValid = await bcrypt.compare(password, food.password)

    if (!isFoodPasswordValid) { 
        return res.status(400).json({
            message : "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id:food._id
    },jwt_secret)
    
    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" })
    
    res.status(200).json({
        message: "User Login Successfully",
        food : { 
            _id: food._id,
            email: food.email,
            name: food.name
        }
    })
}

async function logoutFoodPartner(req,res) { 
    res.clearCookie("token")
        res.status(200).json({
            message: " User Successfully Logged out"
        })
}

async function updateUserProfile(req, res) {
  const { name, email } = req.body;
  const user = req.user;

  try {
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    if (email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email is already in use by another account" });
      }
    }

    user.name = name;
    user.email = email;
    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export {registerUser,loginUser,logoutUser,registerFoodPartner,loginFoodPartner,logoutFoodPartner, updateUserProfile}