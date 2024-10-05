require("dotenv").config()
import { Request,Response } from "express"
import Training from "../models/Training"
import Plan from "../models/Plan"
import Params from "../interfaces/Params"
import { AddTrainingBody,TrainingHistory,Training as FoundTraining, TrainingSession, RankInfo, TrainingsDates,UserRanking } from "../interfaces/Training"
import ResponseMessage from "./../interfaces/ResponseMessage"
import User from "./../models/User"
import FieldScore from "./../interfaces/FieldScore"
import { compareDates } from "./../helpers/DatesHelpers"
import { ranks } from "./userController"
import { Message } from "../enums/Message"
import { TrainingForm } from "../interfaces/Training"
import {addExercisesScores} from "./exercisesScoresController"
import { ExerciseScoresForm } from "../interfaces/ExercisesScores"




const addTraining = async(req:Request<Params,{},TrainingForm>,res:Response<ResponseMessage>)=>{
    const user = req.params.id
    const planDay = req.body.type
    const createdAt = req.body.createdAt
    const response = await Training.create({user:user,type:planDay,createdAt:createdAt})
    if(!response) return res.status(404).send({msg:Message.TryAgain})
    const exercises:ExerciseScoresForm[] = req.body.exercises.map(ele=>{return {...ele,training:response._id,user:user,date:createdAt}})
    const result:{exerciseScoreId:string}[] = await Promise.all(exercises.map(ele=>addExercisesScores(ele)))
    await response.updateOne({exercises:result})
    return res.status(200).send({msg:Message.Created})
}

export {addTraining}



