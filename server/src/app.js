import express from "express"
import { configDotenv } from "dotenv"

const app = express() 

app.use(express.json())



export default app;