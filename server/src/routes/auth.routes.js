import express from "express"
import {registerUser,loginUser,logoutUser, registerFoodPartner, loginFoodPartner,logoutFoodPartner} from "../controllers/auth.controller.js"
const router = express.Router()


//User Auth
router.post('/user/register', registerUser)
router.post('/user/login', loginUser)
router.get('/user/logout',logoutUser)

//Food Partner Auth
router.post('/food/register',registerFoodPartner)
router.post('/food/login',loginFoodPartner)
router.get('/food/logout',logoutFoodPartner)



export default router