import foodPartner from "../models/foodpartner.model.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";


async function authFoodPartnerMiddleware(req,res,next) {
    const token = req.cookies.token; 

    if (!token) { 
        res.status(401).json({
          message :   "Please Login Again"
        })
    }

    try {
        const decoded =  jwt.verify(token,process.env.JWT_SECRET)
        const Partner = await foodPartner.findById(decoded.id)

        req.foodPartner = Partner
        
        next()

    
    } catch (error) {
        return res.status(401).json({
            message : "Invalid Token"
        })
    }
    
}

async function  authUserMiddleware(req,res,next) {
    const token = req.cookies.token 

    if(!token) { 
        res.status(401).json({
          message :   "Please Login Again"
        })
    }
    
    try { 
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id); 
        req.user = user
        
        next()
    
    } catch (err) {

        return res.status(401).json({
            message: "Invalid token"
        })

    }
}


export {authFoodPartnerMiddleware,authUserMiddleware}