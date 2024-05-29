import User from "../models/User"
import { RequestUser, User as UserInterface, UserRecords,Rank,UserElo, UserLoginInfo } from "./../interfaces/User"
import ResponseMessage from "./../interfaces/ResponseMessage"
import { Request,Response } from "express"
import Params from "../interfaces/Params"
import { Message } from "../enums/Message"
const {body, validationResult}= require("express-validator")
const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
require("dotenv").config()

export const ranks:Rank[] = [
    {name:'Junior 1',maxElo:1000},// 0-1000
    {name:'Junior 2',maxElo:2500}, //1000 - 2500
    {name:'Junior 3',maxElo:4000}, //2500 - 4000
    {name:'Mid 1',maxElo:5000}, //4000 - 5000
    {name:'Mid 2',maxElo:6000}, // 5000 - 6000
    {name:'Mid 3',maxElo:7000}, // 6000 - 7000
    {name:'Pro 1',maxElo:10000},// 7000 - 10000
    {name:'Pro 2',maxElo:13000},// 10 000 - 13 000
    {name:'Pro 3',maxElo:17000}, // 13 000 - 17 000
    {name:'Champ',maxElo:20000} // 17 000 - to the sky
]

interface CustomRequestUser extends Request{
    user: typeof User
}

exports.register=[
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
       
        const user = new User({name:name,admin:admin,email:email,rank:'Junior',profileRank:'Junior I',elo:1000})
        await User.register(user,password)
        res.status(200).send({msg:"User created successfully!"})
    })]

exports.login = async function(req:CustomRequestUser,res:Response<{token:string,req:UserLoginInfo}>){
    const token = jwt.sign({id:req.user._id},process.env.JWT_SECRET,{expiresIn:'30d'})
    const userInfo = {
        name: req.user.name,
        _id:req.user._id,
        email:req.user.email,
        Bp:req.user.Bp,
        Dl:req.user.Dl,
        Sq:req.user.Sq
    }
    return res.status(200).send({token:token,req:userInfo})
}

exports.isAdmin = async function(req:Request<{},{},RequestUser>,res:Response<typeof User>){
    const admin = await User.findById(req.body._id)
    return res.status(200).send(admin)
}

exports.getUserInfo = async function(req:Request<Params>,res:Response<string|typeof User>){
    const id = req.params.id
    const UserInfo = await User.findById(id)
    if(UserInfo) return res.status(200).send(UserInfo)
    return res.status(404).send("Didnt find")   
}

exports.setUserRecords = async function(req:Request<{},{},UserRecords>,res:Response<ResponseMessage>){
    const id = req.body.id
    await User.findByIdAndUpdate(id,{Sq:req.body.sq})
    await User.findByIdAndUpdate(id,{Dl:req.body.dl})
    await User.findByIdAndUpdate(id,{Bp:req.body.bp})
    return res.status(200).send({msg:Message.Updated})
}

exports.setUserRank = async function(req:Request<Params,{},{rank:string}>,res:Response<ResponseMessage>){
    const id = req.params.id
    const rank = req.body.rank
    await User.findByIdAndUpdate(id,{rank:rank})
    return res.status(200).send({msg:Message.Updated})
}
exports.updateUserRank = async function(req:Request<Params,{},{}>,res:Response<ResponseMessage>){
    const id = req.params.id
    const user = await User.findById(id)
    const userElo = user.elo
    let userRank=''
    for (let i = 0; i < ranks.length; i++) {
    if (userElo <= ranks[i].maxElo) {
        userRank = ranks[i].name;
        break;
    }}
    
    await User.findByIdAndUpdate(id,{profileRank:userRank})
    return res.send({msg:userRank,isNew:user.profileRank === userRank?false:true})
}

exports.getUserElo = async function(req:Request<Params,{},{}>,res:Response<UserElo | ResponseMessage>){
    const id:string = req.params.id
    const result:typeof User = await User.findById(id)
    if(!result) return res.status(404).send({msg:Message.DidntFind}) 
    return res.status(200).send({
        elo: result.elo
    })

}


