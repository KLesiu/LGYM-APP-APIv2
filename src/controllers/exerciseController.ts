import Params from "../interfaces/Params";
import ResponseMessage from "../interfaces/ResponseMessage";
import { Request,Response } from "express"
import { ExerciseForm } from "../interfaces/Exercise";
import Exercise from "../models/Exercise";
import { Message } from "../enums/Message";
import { BodyParts } from "../enums/BodyParts";
import User from "../models/User";


exports.addExercise=async(req:Request<{},{},ExerciseForm>,res:Response<ResponseMessage>)=>{
    const name = req.body.name
    const bodyPart = req.body.bodyPart
    const description = req.body.description
    const image = req.body.image
    if(!name || !bodyPart) return res.status(400).send({msg:'Name and body part are required!'})
    const exercise = await Exercise.create({name:name,bodyPart:bodyPart,description:description,image:image})
    if(exercise) return res.status(200).send({msg:Message.Created})
    else return res.status(400).send({msg:Message.TryAgain})
}
exports.addUserExercise=async(req:Request<Params,{},ExerciseForm>,res:Response<ResponseMessage>)=>{
    const name = req.body.name
    const bodyPart = req.body.bodyPart
    const description = req.body.description
    const image = req.body.image
    if(!name || !bodyPart) return res.status(400).send({msg:'Name and body part are required!'})
    const user = await User.findById(req.params.id)
    if(!user || !Object.keys(user).length) return res.status(404).send({msg:Message.DidntFind})
    const exercise = await Exercise.create({name:name,bodyPart:bodyPart,description:description,image:image,user:user})
    if(exercise) return res.status(200).send({msg:Message.Created})
    else return res.status(400).send({msg:Message.TryAgain})
}

exports.deleteExercise=async(req:Request<{},{},{id:string}>,res:Response<ResponseMessage>)=>{
    if(!req.body.id) return res.status(400).send({msg:Message.FieldRequired})
    await Exercise.findByIdAndDelete(req.body.id).exec()
    return res.status(200).send({msg:Message.Deleted})
}

exports.updateExercise=async(req:Request<{},{},{id:string,exercise:ExerciseForm}>,res:Response<ResponseMessage>)=>{
    if(!req.body.id) return res.status(400).send({msg:Message.FieldRequired})
    await Exercise.findByIdAndUpdate(req.body.id,req.body.exercise).exec()
    return res.status(200).send({msg:Message.Updated})   
}

exports.getAllExercises=async(req:Request,res:Response<ExerciseForm[] | ResponseMessage>)=>{
    const exercises = await Exercise.find({})
    if(exercises.length > 0) return res.status(200).send(exercises)
    else return res.status(404).send({msg:Message.DidntFind})
}

exports.getExerciseByBodyPart=async(req:Request<{},{},{bodyPart:BodyParts}>,res:Response<ExerciseForm[] | ResponseMessage>)=>{
    const bodyPart = req.body.bodyPart
    const exercises = await Exercise.find({bodyPart:bodyPart})
    if(exercises.length > 0) return res.status(200).send(exercises)
    else return res.status(404).send({msg:Message.DidntFind})
}