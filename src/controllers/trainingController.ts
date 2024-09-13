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


// exports.getInfoAboutRankAndElo=async(req:Request<Params>,res:Response<RankInfo>)=>{
//     const userId = req.params.id
//     const findUser = await User.findById(userId)
//     const userRank = findUser.profileRank
//     const userElo = findUser.elo
//     const nextRankLevel = findRank(userElo)
//     return res.status(200).send({elo:userElo,rank:userRank,nextRank:nextRankLevel?.rank!,nextRankElo:nextRankLevel?.elo!,startRankElo:nextRankLevel?.startElo!})
// }

// exports.getTrainingDates=async(req:Request<Params,{},{date:Date}>,res:Response<TrainingsDates | ResponseMessage>)=>{
//     const userId = req.params.id
//     // const interval= changeDays(req.body.date,10)
//     const trainings= await Training.find({ user: userId }); // Pobierz wszystkie treningi użytkownika
//     if(trainings.length < 1) return res.status(404).send({msg:Message.DidntFind})
//     const trainingsDates:TrainingsDates = {
//         dates:trainings.map((ele:any)=>new Date(ele.createdAt))
//     }
//     return res.status(200).send({
//         dates:trainingsDates.dates
//     })
    
// }

// exports.getBestTenUsersFromElo=async(req:Request,res:Response<UserRanking[] | ResponseMessage>)=>{
//     const users = await User.find().sort({elo:-1}).limit(10)
//     if(users.length < 1) return res.status(404).send({msg:Message.DidntFind})
//     const usersRanking =  users.map((ele:typeof User,index:number)=>{return {user:ele,position:index+1}})
//     return res.status(200).send(usersRanking)
    
// }


// const findRank=(elo:number)=> {
//     for (let i = 0; i < ranks.length; i++) {
//       if (elo <= ranks[i].maxElo) {
//         return {
//             elo:ranks[i].maxElo,
//             rank:ranks[i+1].name,
//             startElo:i===0?0:ranks[i-1].maxElo
//         }
//       }
//     }
//     return null
//   }
// const calculateElo = (newTraining:TrainingSession,prevTraining:TrainingSession):number=>{
//     let score:number = 0
//     newTraining.exercises.forEach((ele:FieldScore,index:number)=>{
//         let currentScore;
//         try{
//         prevTraining.exercises[index].score!=="0"?
//          currentScore = parseFloat(ele.score)-parseFloat(prevTraining.exercises[index].score): currentScore=0
//         }catch{
//             currentScore = 0
//         }
//         if(currentScore > 100) currentScore=100
//         score += currentScore

//     })
//     return score
    

// }

