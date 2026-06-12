import foodPartner from "../models/foodpartner.model";
import jwt from "jsonwebtoken"


async function authFoodPartnerMiddleware(req,res,next) {
    const token = req.cookies.token; 

    if (!token) { 
        res.status(401).json({
          message :   "Please Login Again"
        })
    }

    try {
       const decoded =  jwt.verify(token,process.env.JWT_SECRET)
    } catch (error) {
        
    }
    
}