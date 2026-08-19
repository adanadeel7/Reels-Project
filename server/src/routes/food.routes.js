import express from "express"; 
import createFood, { getFoodItems, getSaveFood, likeFood,saveFood } from "../controllers/food.controller.js";
import {authFoodPartnerMiddleware,authUserMiddleware} from "../middlewares/auth.middleware.js";
import multer from 'multer'
const foodRouter = express.Router()

const upload = multer({
    storage : multer.memoryStorage()
})



foodRouter.post('/',authFoodPartnerMiddleware,createFood)

foodRouter.get("/", authUserMiddleware, getFoodItems)

foodRouter.post('/like', authUserMiddleware, likeFood)

foodRouter.post('/save', authUserMiddleware,saveFood)

foodRouter.get('/save', authUserMiddleware , getSaveFood)

export default foodRouter