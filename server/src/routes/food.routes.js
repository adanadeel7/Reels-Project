import express from "express"; 
import  {createFood, getFoodItems, getPartnerFood, likeFood, saveFood, getSaveFood, uploadVideo } from "../controllers/food.controller.js";
import {authFoodPartnerMiddleware,authUserMiddleware} from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const foodRouter = express.Router()

foodRouter.post('/',authFoodPartnerMiddleware,createFood)

foodRouter.post('/upload', authFoodPartnerMiddleware, upload.single('video'), uploadVideo)

foodRouter.get("/", getFoodItems)

foodRouter.get("/partner", authFoodPartnerMiddleware, getPartnerFood)


foodRouter.post('/like', authUserMiddleware, likeFood)

foodRouter.post('/save', authUserMiddleware,saveFood)

foodRouter.get('/save', authUserMiddleware , getSaveFood)


export default foodRouter