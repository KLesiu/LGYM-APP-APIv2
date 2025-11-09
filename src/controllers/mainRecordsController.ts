import Params from "../interfaces/Params";
import  { Request,Response } from "express";
import ResponseMessage from "../interfaces/ResponseMessage";
import { MainRecordsForm, MainRecordsLast, PossibleRecordForExercise } from "../interfaces/MainRecords";
import User from "../models/User";
import { Message } from "../enums/Message";
import MainRecords from "../models/MainRecords";
import Exercise from "../models/Exercise";
import ExerciseScores from "../models/ExerciseScores";

const addNewRecords = async(req:Request<Params,{},MainRecordsForm>,res:Response<ResponseMessage>)=>{
    const id = req.params.id
    const findUser = await User.findById(id)
    if(!findUser || !Object.keys(findUser).length) return res.status(404).send({msg:Message.DidntFind})
    const findExercise = await Exercise.findById(req.body.exercise)
    if(!findExercise || !Object.keys(findExercise).length) return res.status(404).send({msg:Message.DidntFind})
    const mainRecords = await MainRecords.create({
        user:findUser,
        exercise:findExercise,
        weight:req.body.weight,
        unit:req.body.unit,
        date:req.body.date})
    if(mainRecords)res.status(200).send({msg:Message.Created});
    else res.status(404).send({msg:Message.TryAgain})
}

const getMainRecordsHistory= async(req:Request<Params>,res:Response<ResponseMessage | MainRecordsForm[]>)=>{
    const id = req.params.id
    const findUser = await User.findById(id)
    if(!findUser || !Object.keys(findUser).length) return res.status(404).send({msg:Message.DidntFind})
    const mainRecordsHistory = await MainRecords.find({user:findUser})
    if(mainRecordsHistory.length < 1) return res.status(404).send({msg:Message.DidntFind})
    return res.status(200).send(mainRecordsHistory.reverse())
}

const getLastMainRecords = async (req: Request<Params>, res: Response<ResponseMessage | MainRecordsLast[]>) => {
    const id = req.params.id;
    const findUser = await User.findById(id);
    if (!findUser) return res.status(404).send({ msg: Message.DidntFind });
    
    const mainRecordsHistory: MainRecordsForm[] = await MainRecords.find({ user: findUser });
    if (mainRecordsHistory.length < 1) return res.status(404).send({ msg: Message.DidntFind });

    // Grupowanie według najnowszego rekordu dla każdego ćwiczenia
    const latestRecordsByExercise = mainRecordsHistory.reduce((acc, curr) => {
        if (!acc[curr.exercise] || curr.date > acc[curr.exercise].date) {
            acc[curr.exercise] = curr;
        }
        return acc;
    }, {} as { [exercise: string]: MainRecordsForm });

    // Pobieranie szczegółów dla każdego ćwiczenia
    const latestRecords = await Promise.all(
        Object.values(latestRecordsByExercise).map(async (record) => {
            const exerciseDetails = await Exercise.findById(record.exercise); 
            return {
                //@ts-ignore
                ...record.toObject(),  
                exerciseDetails        
            };
        })
    );

    return res.status(200).send(latestRecords);
};


const deleteMainRecords = async(req:Request<Params>,res:Response<ResponseMessage>)=>{
    const id = req.params.id
    const findMainRecords = await MainRecords.findByIdAndDelete(id)
    if(!findMainRecords) return res.status(404).send({msg:Message.DidntFind})
    return res.status(200).send({msg:Message.Deleted})
}

const updateMainRecords = async(req:Request<Params,{},MainRecordsForm>,res:Response<ResponseMessage>)=>{
    const id = req.params.id
    const findUser = await User.findById(id)
    if(!findUser || !Object.keys(findUser).length) return res.status(404).send({msg:Message.DidntFind}) 
    const findMainRecords = await MainRecords.findById(req.body._id)
    if(!findMainRecords) return res.status(404).send({msg:Message.DidntFind})
    const findExercise = await Exercise.findById(req.body.exercise)
    if(!findExercise || !Object.keys(findExercise).length) return res.status(404).send({msg:Message.DidntFind})
    const updatedMainRecords = await MainRecords.findByIdAndUpdate(id,{
        user:findUser,
        exercise:findExercise,
        weight:req.body.weight,
        date:req.body.date
    })
    if(updatedMainRecords) return res.status(200).send({msg:Message.Updated})
    else return res.status(404).send({msg:Message.TryAgain})
}



const getRecordOrPossibleRecordInExercise = async(req:Request<{},{},{exerciseId:string}>,res:Response<PossibleRecordForExercise | ResponseMessage>)=>{
    const user = req.user?._id
    const exerciseId = req.body.exerciseId
    let record: PossibleRecordForExercise | null = null
    const findRecord = await MainRecords.findOne({user:user,exercise:exerciseId}).sort({date:-1})
    if(!findRecord){
        const possibleRecord = await ExerciseScores.findOne({user:user,exercise:exerciseId}).sort({ weight: -1, reps: -1 })
        if(possibleRecord){
          record={
            weight: possibleRecord.weight,
            reps: possibleRecord.reps,
            unit: possibleRecord.unit,
            date: possibleRecord.createdAt
          }
        }else{
            return res.status(404).send({msg:Message.DidntFind});
        }
    }else{
        record = {
            weight:findRecord.weight,
            reps:1,
            unit:findRecord.unit,
            date:findRecord.date
        }
    }
    return res.status(200).send(record as PossibleRecordForExercise);

}

export {addNewRecords,getMainRecordsHistory,getLastMainRecords,deleteMainRecords,updateMainRecords,getRecordOrPossibleRecordInExercise}