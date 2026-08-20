import express from 'express'
import { authUserMiddleware } from '../middlewares/auth.middleware.js'
import {getFoodPartnerById} from '../controllers/foodpartner.controller.js'

const foodPartnerRouter = express.Router()

foodPartnerRouter.get("/:id", getFoodPartnerById)

export default foodPartnerRouter;