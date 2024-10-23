import User from "../models/User"
import { RequestUser, User as UserInterface,Rank,UserElo, UserLoginInfo,UserInfo, UserBaseInfo } from "./../interfaces/User"
import ResponseMessage from "./../interfaces/ResponseMessage"
import { Request,Response } from "express"
import Params from "../interfaces/Params"
import { Message } from "../enums/Message"
import Training from "../models/Training"
import Measurements from "../models/Measurements"
import Plan from "../models/Plan"
const {body, validationResult}= require("express-validator")
const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
require("dotenv").config()

export const ranks:Rank[] = [
    {name:'Junior 1',needElo:0},// 0-1000
    {name:'Junior 2',needElo:1001}, //1001 - 2500
    {name:'Junior 3',needElo:2500}, //2500 - 4000
    {name:'Mid 1',needElo:4000}, //4000 - 5000
    {name:'Mid 2',needElo:5000}, // 5000 - 6000
    {name:'Mid 3',needElo:6000}, // 6000 - 7000
    {name:'Pro 1',needElo:7000},// 7000 - 10000
    {name:'Pro 2',needElo:10000},// 10 000 - 13 000
    {name:'Pro 3',needElo:13000}, // 13 000 - 17 000
    {name:'Champ',needElo:17000} // 17 000 - to the sky
]

interface CustomRequestUser extends Request{
    user: typeof User
}

const register=[
    body("name").trim().isLength({min:1}).withMessage("Name is required, and has to have minimum one character"),
    body('email').isEmail().withMessage('This email is not valid!'),
    body('password').isLength({min:6}).withMessage('Passwword need to have minimum six characters'),
    body('cpassword').custom((value:string,{req}:{req:Request<{},{},{password:string}>})=>value===req.body.password).withMessage('Passwords need to be same'),
    asyncHandler(async(req:Request<{},{},UserInterface>,res:Response<ResponseMessage | {errors:string[] | ResponseMessage[]} >)=>{
        const errors = validationResult(req)
        
        if(!errors.isEmpty()){
            return res.status(404).send({
                errors:errors.array()
            })
        }
        const name = req.body.name
        const admin = false
        const email = req.body.email
        const password = req.body.password
        
        const checkName = await User.findOne({name:name}).exec()
        if(checkName){
            if(checkName.name===name){
                return res.status(404).send({errors:[
                    {
                        msg:'We have user with that name'
                    }
                ]})
            }
           
        } 

        const checkEmail = await User.findOne({email:email}).exec()
        if(checkEmail){
            if(checkEmail.email === email){
                return res.status(404).send({errors:[
                    {
                        msg:'We have user with that email'
                    }
                ]})
            }
            
        }
       
        const user = new User({name:name,admin:admin,email:email,profileRank:'Junior 1',elo:1000})
        await User.register(user,password)
        res.status(200).send({msg:"User created successfully!"})
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

const isAdmin = async function(req:Request<{},{},RequestUser>,res:Response<typeof User>){
    const admin = await User.findById(req.body._id)
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
    const userInfoWithRank = {
        ...UserInfo.toObject(), 
        nextRank: nextRank || null
    };
    if(UserInfo) return res.status(200).send(userInfoWithRank)
    return res.status(404).send({msg:Message.DidntFind})   
}

const getUsersRanking = async function(req:Request<Params>,res:Response<UserBaseInfo[] | ResponseMessage>){
    const users = await User.find({}).sort({elo:-1})
    if(users) return res.status(200).send(users)
    return res.status(404).send({msg:Message.DidntFind})
}


const getUserElo = async function(req:Request<Params,{},{}>,res:Response<UserElo | ResponseMessage>){
    const id:string = req.params.id
    const result:typeof User = await User.findById(id)
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

const updateUserElo = async (gainElo: number, user: typeof User) => {

    const newElo = gainElo + user.elo;
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
    await user.updateOne({ elo: newElo, profileRank: currentRank.name });
  
    // Zwrócenie obecnej rangi i kolejnej rangi, jeśli istnieje
    return {
      currentRank: currentRank,
      nextRank: nextRank ? nextRank : null
    };
  };

export {register,login,isAdmin,getUserInfo,getUserElo,deleteAccount,getUsersRanking,updateUserElo}


