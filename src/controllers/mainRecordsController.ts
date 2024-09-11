import Params from "../interfaces/Params";
import { Request,Response } from "express";
import ResponseMessage from "../interfaces/ResponseMessage";
import { MainRecordsForm } from "../interfaces/MainRecords";
import User from "../models/User";
import { Message } from "../enums/Message";
import MainRecords from "../models/MainRecords";

exports.addNewRecords = async(req:Request<Params,{},MainRecordsForm>,res:Response<ResponseMessage>)=>{
    const id = req.params.id
    const findUser = await User.findById(id)
    if(!findUser || !Object.keys(findUser).length) return res.status(404).send({msg:Message.DidntFind})
    const mainRecords: typeof MainRecords = await MainRecords.create({
        user:findUser,
        benchPress:req.body.benchPress,
        squat:req.body.squat,
        deadLift:req.body.deadLift,
        date:req.body.date})
    if(mainRecords)res.status(200).send({msg:Message.Created});
    else res.status(404).send({msg:Message.TryAgain})
    
    
}