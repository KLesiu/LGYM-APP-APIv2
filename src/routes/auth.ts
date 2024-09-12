import { checkJwtToken } from "./../middlewares/auth"
import { Request,Response } from "express"
import { register,login,isAdmin,getUserInfo,updateUserRank,getUserElo,deleteAccount } from "../controllers/userController"
const passport = require('passport')
import Router from "./configRouter"
import User from "../models/User"
Router.post('/register',register)
Router.post('/login',passport.authenticate('local',{session:false}),login)
Router.post('/isAdmin',isAdmin)
Router.get('/userInfo/:id',getUserInfo)
Router.get('/checkToken',checkJwtToken,(req:Request,res:Response<{isValid:boolean,user:typeof User}>)=>{
    return res.json({isValid:true,user:req.user})
})
Router.get('/userInfo/:id/userElo',updateUserRank)
Router.get('/userInfo/:id/getUserEloPoints',getUserElo)
Router.post('/deleteAccount',checkJwtToken,deleteAccount)

module.exports = Router