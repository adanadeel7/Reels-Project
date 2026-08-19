import express from "express"; 
import  {createFood, getFoodItems } from "../controllers/food.controller.js";
import {authFoodPartnerMiddleware,authUserMiddleware} from "../middlewares/auth.middleware.js";

const foodRouter = express.Router()

foodRouter.post('/',authFoodPartnerMiddleware,createFood)

foodRouter.get("/", authUserMiddleware, getFoodItems)


foodRouter.post('/like', authUserMiddleware, likeFood)

foodRouter.post('/save', authUserMiddleware,saveFood)

foodRouter.get('/save', authUserMiddleware , getSaveFood)


export default foodRouter