import Params from "../interfaces/Params";
import ResponseMessage from "../interfaces/ResponseMessage";
import { MeasurementForm,MeasurementsHistory,MeasurementsHistoryQuery } from "../interfaces/Measurements";
import { Request,Response } from "express";
import User from "./../models/User"
import Measurements from "./../models/Measurements";
import { Message } from "../enums/Message";


const addMeasurement = () => async(req:Request<{},{},MeasurementForm>,res:Response<ResponseMessage>)=>{
    const findUser = await User.findById(req.body.user)
    if(!findUser) return res.status(404).send({msg:Message.DidntFind})
    const measurement = await Measurements.create({
        user:findUser,
        bodyPart:req.body.bodyPart,
        unit:req.body.unit,
        value:req.body.value
    })
    if(measurement)res.status(200).send({msg:Message.Created})
    else res.status(404).send({msg:Message.TryAgain})
}

const getMeasurementDetails = ()=>async(req:Request<Params>,res:Response<ResponseMessage | MeasurementForm>)=>{
    const id = req.params.id
    const findMeasurement = await Measurements.findById(id)
    if(!findMeasurement) return res.status(404).send({msg:Message.DidntFind})
    return res.status(200).send(findMeasurement)
}

const getMeasurementsHistory = ()=>async(req:Request<Params,{},MeasurementsHistoryQuery>,res:Response<ResponseMessage | MeasurementsHistory>)=>{
    const id = req.params.id
    const findUser = await User.findById(id)
    const measurements =  req.body.bodyPart ? await Measurements.find({user:findUser,bodyPart:req.body.bodyPart}): await Measurements.find({user:findUser})
    if(measurements.length < 1) return res.status(404).send({msg:Message.DidntFind})
    return res.status(200).send({measurements:measurements.reverse()})
}

export { addMeasurement,getMeasurementDetails,getMeasurementsHistory }