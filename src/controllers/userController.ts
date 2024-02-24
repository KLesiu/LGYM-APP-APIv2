//@ts-nocheck

import User from "../models/User"
import { RequestUser, User as UserInterface, UserRecords } from "../interfaces/User"
import ResponseMessage from "../interfaces/ResponseMessage"
import { Request,Response } from "express"
import Params from "../interfaces/Params"
const {body, validationResult}= require("express-validator")
const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.register=[
    body("name").trim().isLength({min:1}).withMessage("Name is required, and has to have minimum one character"),
    body('email').isEmail().withMessage('This email is not valid!'),
    body('password').isLength({min:6}).withMessage('Passwword need to have minimum six characters'),
    body('cpassword').custom((value,{req})=>value===req.body.password).withMessage('Passwords need to be same'),
    asyncHandler(async(req:Request<{},{},UserInterface>,res:Response<ResponseMessage>)=>{
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

exports.login = async function(req:Request<RequestUser>,res:Response<{token:string,req:{req:typeof User}}>){
    const token = jwt.sign({id:req.user._id},process.env.JWT_SECRET,{expiresIn:50000})
    return res.status(200).send({token:token,req:req.user})
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
    return res.status(200).send({msg:'Updated'})
}

exports.setUserRank = async function(req:Request<Params,{},{rank:string}>,res:Response<ResponseMessage>){
    const id = req.params.id
    const rank = req.body.rank
    await User.findByIdAndUpdate(id,{rank:rank})
    return res.status(200).send({msg:'Updated'})
}


