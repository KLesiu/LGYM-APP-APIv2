import { checkJwtToken } from "./../middlewares/auth"
import { Request,Response } from "express"
const userController = require("../controllers/userController")
const passport = require('passport')
import Router from "./configRouter"
import User from "../models/User"
Router.post('/register',userController.register)
Router.post('/login',passport.authenticate('local',{session:false}),userController.login)
Router.post('/isAdmin',userController.isAdmin)
Router.get('/userInfo/:id',userController.getUserInfo)
Router.post('/userRecords',userController.setUserRecords)
Router.post('/userInfo/:id/rank',userController.setUserRank)
Router.get('/checkToken',checkJwtToken,(req:Request,res:Response<{isValid:boolean,user:typeof User}>)=>{
    //@ts-ignore
    return res.json({isValid:true,user:req.user})
})
Router.get('/userInfo/:id/userElo',userController.updateUserRank)

module.exports = Router