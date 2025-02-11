import express from 'express'
const bodyParser = require("body-parser")
require("dotenv").config()
const cors = require("cors")
const auth = require("./routes/auth")
const plan = require('./routes/plan')
const training = require("./routes/training")
const measurements = require("./routes/measurements")
const mainRecords = require("./routes/mainRecords")
const exercise = require("./routes/exercise")
const planDay = require("./routes/planDay")
const eloRegistry = require("./routes/eloRegistry")
const mongoose = require("mongoose")
const exerciseScores = require("./routes/exerciseScores")
import gym from "./routes/gym"

// Mongoose connection
mongoose.set("strictQuery",false)
const mongoDB = process.env.MONGO_CONNECT
main().catch((err)=>console.log(err))
async function main(){
    await mongoose.connect(mongoDB)
}

// Config app
const app=express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

// Passport
const passport = require("./config/passport").passportConfig
passport()


// Routes
app.use('/api',auth)
app.use('/api',plan)
app.use('/api',training)
app.use("/api",measurements)
app.use("/api",mainRecords)
app.use("/api",exercise)
app.use("/api",planDay)
app.use("/api",gym)
app.use("/api",eloRegistry)
app.use("/api",exerciseScores)


module.exports = app

// Server
const server = require('./server')
server





