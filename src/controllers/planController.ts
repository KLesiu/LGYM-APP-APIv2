import { Request,Response } from 'express'
import Plan from '../models/Plan'
import Params from "../interfaces/Params"
import ResponseMessage from '../interfaces/ResponseMessage'
import { DaysOfPlan, PlanSession, SharedPlan } from '../interfaces/Plan'
import User from '../models/User'
require("dotenv").config()

exports.setPlanConfig=async(req:Request<Params,{},PlanSession>,res:Response<ResponseMessage>)=>{
    const days = +req.body.days!
    const name = req.body.name
    const id = req.params.id
    if(!name || !days) return res.send({msg:'All fields are required'})
    if(days< 1 || days > 7) return res.send({msg:'You have to choose days number between 1-7'})
    const findUser = await User.findById(id)
    const currentPlan = await Plan.create({user:findUser,name:name,trainingDays:days})
    await findUser.updateOne({plan:currentPlan})
    return res.send({msg:"Created"})
}

exports.getPlanConfig=async(req:Request<Params>,res:Response<{count:number}>)=>{
    const id = req.params.id
    const findUser = await User.findById(id)
    const findPlan = await Plan.findOne({user:findUser})
    return res.send({count:findPlan.trainingDays})
}

exports.setPlanShared=async(user:typeof User,planConfig:SharedPlan,res:Response<ResponseMessage>)=>{
    const currentPlan = await Plan.create({user:user,name:planConfig.name,trainingDays:planConfig.trainingDays})
    await user.updateOne({plan:currentPlan})
    const days = planConfig.days
    const findPlan = await Plan.findOne({user:user})
    if(planConfig.trainingDays === 1){
        await findPlan.updateOne({planA:days[0].exercises})
        return res.send({msg:'Updated'}) 
    }
    else if(planConfig.trainingDays === 2){
        await findPlan.updateOne({planA:days[0].exercises,planB:days[1].exercises})
        return res.send({msg:'Updated'})
    }
    else if(planConfig.trainingDays === 3){
        await findPlan.updateOne({planA:days[0].exercises,planB:days[1].exercises,planC:days[2].exercises})
        return res.send({msg:'Updated'})
    }
    else if(planConfig.trainingDays === 4){
        await findPlan.updateOne({planA:days[0].exercises,planB:days[1].exercises,planC:days[2].exercises,planD:days[3].exercises})
        return res.send({msg:'Updated'})
    }
    else if(planConfig.trainingDays === 5){
        await findPlan.updateOne({planA:days[0].exercises,planB:days[1].exercises,planC:days[2].exercises,planD:days[3].exercises,planE:days[4].exercises})
        return res.send({msg:'Updated'})
    }
    else if(planConfig.trainingDays === 6){
        await findPlan.updateOne({planA:days[0].exercises,planB:days[1].exercises,planC:days[2].exercises,planD:days[3].exercises,planE:days[4].exercises,planF:days[5].exercises})
        return res.send({msg:'Updated'})
    }
    else if(planConfig.trainingDays === 7){
        await findPlan.updateOne({planA:days[0].exercises,planB:days[1].exercises,planC:days[2].exercises,planD:days[3].exercises,planE:days[4].exercises,planF:days[5].exercises,planG:days[6].exercises})
        return res.send({msg:'Updated'})
    }
    else{
        return res.send({msg:"Error, try again"})
    }
}

exports.setPlan=async(req:Request<Params,{},{days:DaysOfPlan}>,res:Response<ResponseMessage>)=>{
    const id = req.params.id
    const findUser = await User.findById(id)
    const findPlan = await Plan.findOne({user:findUser})
    const days = req.body.days.days
    if(days.length === 1){
        await findPlan.updateOne({planA:days[0].exercises})
        return res.send({msg:'Updated'})
    }
    else if(days.length === 2){
        await findPlan.updateOne({planA:days[0].exercises,planB:days[1].exercises})
        return res.send({msg:'Updated'})
    }
    else if(days.length === 3){
        await findPlan.updateOne({planA:days[0].exercises,planB:days[1].exercises,planC:days[2].exercises})
        return res.send({msg:'Updated'})
    }
    else if(days.length === 4){
        await findPlan.updateOne({planA:days[0].exercises,planB:days[1].exercises,planC:days[2].exercises,planD:days[3].exercises})
        return res.send({msg:'Updated'})
    }
    else if(days.length === 5){
        await findPlan.updateOne({planA:days[0].exercises,planB:days[1].exercises,planC:days[2].exercises,planD:days[3].exercises,planE:days[4].exercises})
        return res.send({msg:'Updated'})
    }
    else if(days.length === 6){
        await findPlan.updateOne({planA:days[0].exercises,planB:days[1].exercises,planC:days[2].exercises,planD:days[3].exercises,planE:days[4].exercises,planF:days[5].exercises})
        return res.send({msg:'Updated'})
    }
    else if(days.length === 7){
        await findPlan.updateOne({planA:days[0].exercises,planB:days[1].exercises,planC:days[2].exercises,planD:days[3].exercises,planE:days[4].exercises,planF:days[5].exercises,planG:days[6].exercises})
        return res.send({msg:'Updated'})
    }
    else{
        return res.send({msg:"Error, try again"})
    }
    

}

exports.getPlan= async(req:Request<Params>,res:Response<{data:PlanSession} | {data:string}>)=>{
    const id = req.params.id
    const findUser = await User.findById(id)
    const findPlan = await Plan.findOne({user:findUser})
    if(findPlan) return res.status(200).send({data:{ planA: findPlan.planA,
        planB: findPlan.planB,
        planC: findPlan.planC,
        planD: findPlan.planD,
        planE: findPlan.planE,
        planF: findPlan.planF,
        planG: findPlan.planG}
       
    })
    else return res.status(404).send({data:'Didnt find'})
}

exports.deletePlan=async(req:Request<Params>,res:Response<ResponseMessage>)=>{
   const id = req.params.id
   const findUser = await User.findById(id)
   const deletedPlan = await Plan.findOneAndDelete({user:findUser})
   await findUser.updateOne({ $unset: { plan: 1 } }, { new: true })
   if(deletedPlan) return res.status(200).send({msg: 'Deleted!'})
   else return res.status(404).send({msg:'Didnt find!'})
}

exports.getSharedPlan=async(req:Request<Params>)=>{
    const user = await User.findById(req.params.id)
    const id = req.body.user_id
    const findUser = await User.findById(id)
    const userPlan = await Plan.findOne({user:findUser})
    const sharedPlan = {
        name: userPlan.name,
        days:[
            {exercises:userPlan.planA},
            {exercises:userPlan.planB},
            {exercises:userPlan.planC},
            {exercises:userPlan.planD},
            {exercises:userPlan.planE},
            {exercises:userPlan.planF},
            {exercises:userPlan.planG},

        ],
        trainingDays:userPlan.trainingDays
    }
    //@ts-ignore
    this.setPlanShared(user,sharedPlan)

}

