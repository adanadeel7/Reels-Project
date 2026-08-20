import express from "express"
import {registerUser,loginUser,logoutUser, registerFoodPartner, loginFoodPartner,logoutFoodPartner, updateUserProfile} from "../controllers/auth.controller.js"
import { authUserMiddleware } from "../middlewares/auth.middleware.js"
const router = express.Router()


router.post('/user/register', registerUser)
router.post('/user/login', loginUser)
router.get('/user/logout',logoutUser)
router.put('/user/profile', authUserMiddleware, updateUserProfile)

router.post('/food/register',registerFoodPartner)
router.post('/food/login',loginFoodPartner)
router.get('/food/logout',logoutFoodPartner)



export default router