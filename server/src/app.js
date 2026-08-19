import express from "express"
import { configDotenv } from "dotenv"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import foodRoutes from "./routes/food.routes.js"
import cors from 'cors'
import foodPartnerRoutes from "./routes/foodPartner.routes.js"


const app = express() 

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())

app.get("/", (req,res) => { 
    res.send("Hello World!")
})

app.use('/api/auth', authRoutes)
app.use('/api/food', foodRoutes)
app.use('/api/food-partner', foodPartnerRoutes)



export default app;