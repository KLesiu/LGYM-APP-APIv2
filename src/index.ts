import express from 'express'
const bodyParser = require("body-parser")
require("dotenv").config()
const cors = require("cors")
const auth = require("./routes/auth")
const plan = require('./routes/plan')
const training = require("./routes/training")
const measurements = require("./routes/measurements")
const mongoose = require("mongoose")


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


module.exports = app

// Server
const server = require('./server')
server





