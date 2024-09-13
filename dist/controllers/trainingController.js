"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTraining = void 0;
require("dotenv").config();
const Training_1 = __importDefault(require("../models/Training"));
const Message_1 = require("../enums/Message");
const exercisesScoresController_1 = require("./exercisesScoresController");
const addTraining = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.params.id;
    const planDay = req.body.type;
    const createdAt = req.body.createdAt;
    const response = yield Training_1.default.create({ user: user, type: planDay, createdAt: createdAt });
    if (!response)
        return res.status(404).send({ msg: Message_1.Message.TryAgain });
    const exercises = req.body.exercises.map(ele => { return Object.assign(Object.assign({}, ele), { training: response._id, user: user, date: createdAt }); });
    const result = yield Promise.all(exercises.map(ele => (0, exercisesScoresController_1.addExercisesScores)(ele)));
    const newTraining = yield response.updateOne({ exercises: result });
    //@ts-ignore
    return res.status(200).send({ msg: newTraining });
});
exports.addTraining = addTraining;
// exports.addTraining=async(req:Request<Params,{},AddTrainingBody>,res:Response<ResponseMessage>)=>{
//     const id = req.params.id
//     const findUser = await User.findById(id)
//     const day = req.body.day
//     const exercises = req.body.training
//     const createdAt = req.body.createdAt
//     const plan = await Plan.findOne({user:findUser})
//     const date = new Date(createdAt).toString()
//     const prevSessions = await Training.find({user:findUser,type:day,plan:plan})
//     const prevSession = prevSessions[prevSessions.length-1]
//     const newTraining = await Training.create({user:findUser,type:day,exercises:exercises,createdAt:date,plan:plan})
//     if(prevSessions.length >0)await User.findByIdAndUpdate(id,{elo:findUser.elo += calculateElo(newTraining,prevSession)}) 
//     if(newTraining) res.status(200).send({msg:'Training added'})
//     else res.status(404).send({msg:'Error, We didnt add your training!'})
// }
// exports.getTrainingHistory=async(req:Request<Params>,res:Response<ResponseMessage | TrainingHistory>)=>{
//     const id = req.params.id
//     const findUser = await User.findById(id)
//     if(findUser){
//         const trainings = await Training.find({user:findUser})
//         const reverseTraining = trainings.reverse()
//         if(trainings.length>0) return res.status(200).send({trainingHistory:reverseTraining})
//         else return res.status(404).send({msg:'You dont have trainings!'})
//     }
//     else return res.status(404).send({msg:'Error, we dont find You in our database. Please logout and login one more time.'})
// }
// exports.getTraining=async(req:Request<Params,{},{createdAt:string}>,res:Response<ResponseMessage | TrainingSession>)=>{
//     const id = req.params.id
//     const findUser = await User.findById(id)
//     if(!findUser) return res.status(404).send({msg:'Error, we dont find you in our database.'})
//     const trainings:TrainingSession[] = await Training.find({user:findUser})
//     const training = trainings.filter((training:TrainingSession)=>compareDates(new Date(req.body.createdAt),new Date(training.createdAt)))
//     if(training.length < 1) return res.status(404).send({msg:'Error, we dont find training with send date'})
//     return res.status(200).send(training[0])
// }
// exports.getCurrentTrainingSession=async(req:Request<Params>,res:Response<FoundTraining | ResponseMessage>)=>{
//     const id = req.params.id 
//     const findTraining = await Training.findById(id)
//     if(findTraining){
//         return res.status(200).send({training:findTraining})
//     }
//     else return res.status(404).send({msg:'We dont find your training session!, Please logout and login one more time'})
// }
// exports.getLastTrainingSession=async(req:Request<Params>,res:Response<TrainingSession | ResponseMessage>)=>{
//     const id = req.params.id
//     const findUser = await User.findById(id)
//     if(!findUser)return res.status(404).send({msg:'Error we dont find you! Please logout and login one more time'})
//     const trainings = await Training.find({user:findUser})
//     if(!trainings || trainings.length === 0) return res.status(404).send({msg:'You dont have trainings!'})
//     return res.status(200).send(trainings.reverse()[0])
// }
// exports.getPreviousTrainingSession=async(req:Request<Params>,res:Response<FoundTraining | ResponseMessage>)=>{
//     const userId = req.params.id
//     const findUser = await User.findById(userId)
//     const trainingType = req.params.day
//     const currentPlan = await Plan.find({user:userId})
//     const prevSession = await Training.find({user:findUser,type:trainingType,plan:currentPlan})
//     if(prevSession) return res.status(200).send({prevSession:prevSession[prevSession.length-1]})
//     return res.status(404).send({msg: 'Didnt find previous session training'})
// }
// exports.checkPreviousTrainingSession=async(req:Request<Params>,res:Response<ResponseMessage>)=>{
//     const userId = req.params.id
//     const findUser = await User.findById(userId)
//     const trainingType = req.params.day
//     const plan = findUser.plan
//     const prevSessions = await Training.find({user:findUser,type:trainingType,plan:plan})
//     const prevSession = prevSessions[prevSessions.length-1]
//     if(prevSession) return res.status(200).send({msg:'Yes'})
//     else return res.status(404).send({msg:'No'})
// }
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
