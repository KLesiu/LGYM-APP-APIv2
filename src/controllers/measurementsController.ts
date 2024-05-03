import Params from "../interfaces/Params";
import ResponseMessage from "../interfaces/ResponseMessage";
import { MeasurementForm,MeasurementsHistory ,Measurement} from "../interfaces/Measurements";
import { Request,Response } from "express";
import User from "./../models/User"
import Measurements from "./../models/Measurements";
import { Message } from "../enums/Message";


exports.addMeasurements= async(req:Request<Params,{},MeasurementForm>,res:Response<ResponseMessage>)=>{
    const id = req.params.id
    const findUser = await User.findById(id)
    const measurement:typeof Measurements = await Measurements.create({
        user:findUser,
        weight:req.body.weight,
        neck:req.body.neck,
        chest:req.body.chest,
        biceps:req.body.biceps,
        waist:req.body.waist,
        abdomen:req.body.abdomen,
        hips:req.body.hips,
        thigh:req.body.thigh,
        calf:req.body.calf

    })
    if(measurement){
        res.status(200).send({msg:Message.Created})
    }
    else res.status(404).send({msg:Message.TryAgain})
}

exports.getMeasurementsHistory = async(req:Request<Params>,res:Response<ResponseMessage |MeasurementsHistory>)=>{
    const id = req.params.id
    const findUser = await User.findById(id)
    if(!findUser) return res.status(404).send({msg:Message.DidntFind})
    const measurementsHistory = await Measurements.find({user:findUser})
    if(measurementsHistory.length < 1) return res.status(404).send({msg:Message.DidntFind})
    return res.status(200).send({measurements: measurementsHistory.reverse()})
}

exports.getLastMeasurements = async(req:Request<Params>,res:Response<ResponseMessage |MeasurementForm>)=>{
    const id = req.params.id
    const findUser = await User.findById(id)
    if(!findUser) return res.status(404).send({msg:Message.DidntFind})
    const measurementsHistory:Measurement[] = await Measurements.find({user:findUser})
    if(measurementsHistory.length < 1) return res.status(404).send({msg:Message.DidntFind})
    const lastMeasurements:Measurement = measurementsHistory.reduce((acc:Measurement, curr:Measurement) => {
        if (!acc || curr.createdAt > acc.createdAt) {
          return curr; 
        } else {
          return acc;
        }
      });
    const modifiedMeasurement:MeasurementForm = {
        weight: lastMeasurements.weight,
        neck:lastMeasurements.neck,
        chest:lastMeasurements.chest,
        biceps:lastMeasurements.biceps,
        waist:lastMeasurements.waist,
        abdomen:lastMeasurements.abdomen,
        hips:lastMeasurements.hips,
        thigh:lastMeasurements.thigh,
        calf:lastMeasurements.calf
    }
    return res.status(200).send(modifiedMeasurement)
    
}