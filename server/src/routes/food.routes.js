import express from "express"; 
import createFood from "../controllers/food.controller.js";
import {authFoodPartnerMiddleware} from "../middlewares/auth.middleware.js";

const foodRouter = express.Router()

foodRouter.post('/',authFoodPartnerMiddleware,createFood)

foodRouter.get("/", au)

export default foodRouter