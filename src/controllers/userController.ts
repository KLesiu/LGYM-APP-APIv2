import User from "../models/User"
import { RegisterUser,Rank,UserElo, UserLoginInfo,UserInfo, UserBaseInfo } from "./../interfaces/User"
import ResponseMessage from "./../interfaces/ResponseMessage"
import { Request,Response } from "express"
import Params from "../interfaces/Params"
import { Message } from "../enums/Message"
import Training from "../models/Training"
import Measurements from "../models/Measurements"
import Plan from "../models/Plan"
import EloRegistry from "../models/EloRegistry"
const {body, validationResult}= require("express-validator")
const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
require("dotenv").config()

export const ranks:Rank[] = [
    {name:'Junior 1',needElo:0},// 0-1000
    {name:'Junior 2',needElo:1001}, //1001 - 2500
    {name:'Junior 3',needElo:2500}, //2500 - 4000
    {name:'Mid 1',needElo:6000}, //6000 - 8000
    {name:'Mid 2',needElo:8000}, // 8000 - 12000
    {name:'Mid 3',needElo:12000}, // 12000 - 15000
    {name:'Pro 1',needElo:15000},// 15000 - 20000
    {name:'Pro 2',needElo:20000},// 20 000 - 24 000
    {name:'Pro 3',needElo:24000}, // 24 000 - 30 000
    {name:'Champ',needElo:30000} // 30 000 - to the sky
]

interface CustomRequestUser extends Request{
    user: typeof User
}

const register=[
    body("name").trim().isLength({min:1}).withMessage(Message.NameIsRequired),
    body('email').isEmail().withMessage(Message.EmailInvalid),
    body('password').isLength({min:6}).withMessage(Message.PasswordMin),
    body('cpassword').custom((value:string,{req}:{req:Request<{},{},{password:string}>})=>value===req.body.password).withMessage(Message.SamePassword),
    asyncHandler(async(req:Request<{},{},RegisterUser>,res:Response<ResponseMessage>)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(404).send({
                msg: errors.array()[0].msg
            })
        }
        const name = req.body.name
        const admin = false
        const email = req.body.email
        const password = req.body.password
        
        const existingUser = await User.findOne({
            $or: [
                { name: name },
                { email: email }
            ]
        }).exec();
        
        if (existingUser) {
            if (existingUser.name === name) {
                return res.status(404).send({ msg: Message.UserWithThatName });
            }
        
            if (existingUser.email === email) {
                return res.status(404).send({ msg: Message.UserWithThatEmail });
            }
        }
       
        const user = new User({name:name,admin:admin,email:email,profileRank:'Junior 1'})
        await User.register(user,password)
        await EloRegistry.create({user:user._id,date:new Date(),elo:1000})
        res.status(200).send({msg:Message.Created})
    })]

const login = async function(req:CustomRequestUser,res:Response<{token:string,req:UserLoginInfo}>){
    const token = jwt.sign({id:req.user._id},process.env.JWT_SECRET,{expiresIn:'30d'})
    const userInfo = {
        name: req.user.name,
        _id:req.user._id,
        email:req.user.email,
        avatar:req.user.avatar

    }
    return res.status(200).send({token:token,req:userInfo})
}

const isAdmin = async function(req:Request<Params,{},{}>,res:Response<typeof User>){
    const admin = await User.findById(req.params.id)
    return res.status(200).send(admin.admin)
}

const getUserInfo = async function(req:Request<Params>,res:Response<UserInfo | ResponseMessage>){
    const id = req.params.id
    const UserInfo = await User.findById(id)
    let nextRank:Rank = ranks[0]
    ranks.forEach((rank,index)=>{ 
        if(rank.name===UserInfo.profileRank){
            nextRank = ranks[index+1]
        }
    })
    const userElo = await EloRegistry.findOne({user:id}).sort({date:-1})
    const userInfoWithRank = {
        ...UserInfo.toObject(), 
        nextRank: nextRank || null,
        elo: userElo && userElo.elo ? userElo.elo : 1000
    };
    if(UserInfo) return res.status(200).send(userInfoWithRank)
    return res.status(404).send({msg:Message.DidntFind})   
}

const getUsersRanking = async function(req: Request, res: Response<UserBaseInfo[] | ResponseMessage>) {
    const users = await User.aggregate([
        {
            $lookup: {
                from: 'eloregistries',            // Nazwa kolekcji EloRegistry
                let: { userId: '$_id' },          // Definicja zmiennej `userId` z `_id` użytkownika
                pipeline: [
                    { $match: { $expr: { $eq: ['$user', '$$userId'] } } }, // Dopasowanie do użytkownika
                    { $sort: { date: -1 } },       // Sortowanie malejąco po `date`, najnowszy jako pierwszy
                    { $limit: 1 }                  // Pobranie tylko najnowszego wpisu
                ],
                as: 'eloRecords'                  // Wynik jako tablica `eloRecords` (będzie miała maksymalnie jeden element)
            }
        },
        {
            $addFields: {
                // Wyciągnięcie najnowszego `elo` lub ustawienie wartości domyślnej 1000, jeśli brak wpisów
                elo: { $ifNull: [{ $arrayElemAt: ["$eloRecords.elo", 0] }, 1000] }
            }
        },
        {
            $sort: { elo: -1 } // Sortowanie według elo malejąco
        },
        {
            $project: {
                name: 1,
                avatar: 1,
                elo: 1,
                profileRank: 1
            }
        }
    ]);

    // Zwrócenie listy użytkowników lub komunikat błędu
    if (users.length) return res.status(200).send(users);
    else return res.status(404).send({ msg: Message.DidntFind });
};






const getUserElo = async function(req:Request<Params,{},{}>,res:Response<UserElo | ResponseMessage>){
    const id:string = req.params.id
    const result = await EloRegistry.findOne({user:id}).sort({date:-1}).limit(1)
    if(!result) return res.status(404).send({msg:Message.DidntFind}) 
    return res.status(200).send({
        elo: result.elo
    })

}

//TODO : Do poprawy
const deleteAccount = async function(req:Request<{},{},{email:string}>,res:Response<ResponseMessage>){
    const currentUser = req.user
    if(currentUser.email !== req.body.email) return res.status(401).send({msg:'Wrong email!'})
    const trainings:typeof Training[] = await Training.find({user:currentUser._id})
    const measurements:typeof Measurements[] =await  Measurements.find({user:currentUser._id})
    const plans:typeof Plan =await  Plan.find({user:currentUser._id})
    const trainingDeletions = trainings.map((training) =>
        Training.findByIdAndDelete(training._id).exec()
      );
      const measurementDeletions = measurements.map((measurement) =>
        Measurements.findByIdAndDelete(measurement._id).exec()
      );
      const planDeletions = plans.map((plan:typeof Plan) =>
        Plan.findByIdAndDelete(plan._id).exec()
      );
    await Promise.all([...trainingDeletions, ...measurementDeletions, ...planDeletions]);
    await User.findByIdAndDelete(currentUser._id)
    return res.send({msg:Message.Deleted})


}

const updateUserElo = async (gainElo: number,currentElo:number, user: typeof User,trainingId:string | undefined) => {

    const newElo = gainElo +currentElo;
    // Znalezienie odpowiedniej rangi na podstawie wartości ELO
    const currentRank = ranks.reduce((current, next) => {
      if (newElo >= next.needElo) {
        return next;
      }
      return current;
    }, ranks[0]);
  
    // Znalezienie następnej rangi, jeśli istnieje
    const currentRankIndex = ranks.findIndex(rank => rank.name === currentRank.name);
    const nextRank = ranks[currentRankIndex + 1] || null; // Jeśli nie ma wyższej rangi, zwróć null
  
    // Zaktualizowanie danych użytkownika w bazie danych
    await user.updateOne({  profileRank: currentRank.name });
    await EloRegistry.create({ user: user._id, date: new Date(), elo: newElo,training:trainingId });
  
    // Zwrócenie obecnej rangi i kolejnej rangi, jeśli istnieje
    return {
      currentRank: currentRank,
      nextRank: nextRank ? nextRank : null
    };
  };

export {register,login,isAdmin,getUserInfo,getUserElo,deleteAccount,getUsersRanking,updateUserElo}


