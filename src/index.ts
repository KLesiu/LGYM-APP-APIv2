import express from 'express'
const bodyParser = require("body-parser")
require("dotenv").config()
const cors = require("cors")
const mongoose = require("mongoose")
import gym from "./routes/gym"
import appConfig from './routes/appConfig'
import auth from './routes/auth'
import eloRegistry from './routes/eloRegistry'
import exercise from './routes/exercise'
import exerciseScores from './routes/exerciseScores'
import mainRecords from './routes/mainRecords'
import measurements from './routes/measurements'
import plan from './routes/plan'
import planDay from './routes/planDay'
import training from './routes/training'
import { apiUserLimiter } from './middlewares/rateLimiters'
import { middlewareAuth } from './middlewares/auth'
import { Server } from "http"; 



// Mongoose connection
mongoose.set("strictQuery",false)
const mongoDB = process.env.MONGO_CONNECT
main().catch((err)=>console.log(err))
async function main(){
    await mongoose.connect(mongoDB)
}

// Config app
const app=express()
app.set('trust proxy', 1);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

// Passport
const passport = require("./config/passport").passportConfig
passport()


// Routes
app.use('/api',middlewareAuth,apiUserLimiter,auth)
app.use('/api',middlewareAuth,apiUserLimiter,plan)
app.use('/api',middlewareAuth,apiUserLimiter,training)
app.use("/api",middlewareAuth,apiUserLimiter,measurements)
app.use("/api",middlewareAuth,apiUserLimiter,mainRecords)
app.use("/api",middlewareAuth,apiUserLimiter,exercise)
app.use("/api",middlewareAuth,apiUserLimiter,planDay)
app.use("/api",middlewareAuth,apiUserLimiter,gym)
app.use("/api",middlewareAuth,apiUserLimiter,eloRegistry)
app.use("/api",middlewareAuth,apiUserLimiter,exerciseScores)
app.use("/api",middlewareAuth,apiUserLimiter,appConfig)


// Server
const PORT: number = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});





