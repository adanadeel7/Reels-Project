import express from "express"
import { configDotenv } from "dotenv"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"

const app = express() 
app.use(cookieParser())
app.use(express.json())

app.use('/api/auth', authRoutes)


export default app;