require("dotenv").config()
import { Request,Response } from "express"
import Training from "../models/Training"
import Plan from "../models/Plan"
import Params from "../interfaces/Params"
import { addTrainingBody } from "../interfaces/Training"

exports.addTraining=async(req:Request<Params,{},addTrainingBody>,res:Response)=>{
    const id = req.params.id
    const findUser = await User.findById(id)
    const day = req.body.day
    const exercises = req.body.training
    const createdAt = req.body.createdAt
    const plan = await Plan.findOne({user:findUser})
    const date = new Date(createdAt).toString()
    const newTraining = await Training.create({user:findUser,type:day,exercises:exercises,createdAt:date,plan:plan})
    if(newTraining) res.status(200).send({msg:'Training added'})
    else res.status(404).send({msg:'Error, We didnt add your training!'})
}

exports.getTrainingHistory=async(req:Request<Params>,res:Response)=>{
    const id = req.params.id
    const findUser = await User.findById(id)
    if(findUser){
        const trainings = await Training.find({user:findUser})
        const reverseTraining = trainings.reverse()
        if(trainings.length>0) return res.status(200).send({trainingHistory:reverseTraining})
        else return res.status(404).send({msg:'You dont have trainings!'})
    }
    else return res.status(404).send({msg:'Error, we dont find You in our database. Please logout and login one more time.'})
}

exports.getCurrentTrainingSession=async(req:Request<Params>,res:Response)=>{
    const id = req.params.id 
    const findTraining = await Training.findById(id)
    if(findTraining){
        return res.status(200).send({training:findTraining})
    }
    else return res.status(404).send({msg:'We dont find your training session!, Please logout and login one more time'})
}

exports.getPreviousTrainingSession=async(req:Request<Params>,res:Response)=>{
    const userId = req.params.id
    const findUser = await User.findById(userId)
    const trainingType = req.params.day
    const prevSession = await Training.find({user:findUser,type:trainingType})
    if(prevSession) return res.status(200).send({prevSession:prevSession[prevSession.length-1]})
    return res.status(404).send({msg: 'Didnt find previous session training'})

}
exports.checkPreviousTrainingSession=async(req:Request<Params>,res:Response)=>{
    const userId = req.params.id
    const findUser = await User.findById(userId)
    const trainingType = req.params.day
    const plan = findUser.plan
    const prevSessions = await Training.find({user:findUser,type:trainingType,plan:plan})
    const prevSession = prevSessions[prevSessions.length-1]
    if(prevSession) return res.status(200).send({msg:'Yes'})
    else return res.status(404).send({msg:'No'})
}