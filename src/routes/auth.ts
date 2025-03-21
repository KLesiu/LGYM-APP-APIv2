import { checkJwtToken } from "./../middlewares/auth"
import { Request,Response } from "express"
import { register,login,isAdmin,getUserInfo,getUserElo, getUsersRanking } from "../controllers/userController"
const passport = require('passport')
import Router from "./configRouter"
import  { UserEntityStatics } from "./../models/User"
Router.post('/register',register)
Router.post('/login',passport.authenticate('local',{session:false}),login)
Router.get('/:id/isAdmin',isAdmin)
Router.get('/:id/getUserInfo',getUserInfo)
Router.get('/checkToken',checkJwtToken,(req:Request,res:Response<{isValid:boolean,user:UserEntityStatics | undefined}>)=>{
    return res.json({isValid:true,user:req.user})
})
Router.get('/getUsersRanking',getUsersRanking)
Router.get('/userInfo/:id/getUserEloPoints',getUserElo)

module.exports = Router