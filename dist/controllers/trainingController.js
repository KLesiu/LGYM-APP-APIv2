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
    yield response.updateOne({ exercises: result });
    return res.status(200).send({ msg: Message_1.Message.Created });
});
exports.addTraining = addTraining;
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
