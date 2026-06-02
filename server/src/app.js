import express from "express"
import { configDotenv } from "dotenv"
import cookieParser from "cookie-parser"


const app = express() 
app.use(cookieParser())
app.use(express.json())



export default app;