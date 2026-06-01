import connectDB from "./src/db/db.js";
import app from "./src/app.js";
import dotenv from "dotenv";
dotenv.config()

const Port = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL

connectDB(DATABASE_URL)


app.listen(Port, () => { 
    console.log(`Server is running on ${Port}`)
})