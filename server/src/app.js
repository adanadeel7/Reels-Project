import express from "express"
import { configDotenv } from "dotenv"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import foodRoutes from "./routes/food.routes.js"



const app = express() 
app.use(cookieParser())
app.use(express.json())


app.use('/api/auth', authRoutes)
app.use('/api/auth', foodRoutes)

export default app;