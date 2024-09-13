import Params from "../interfaces/Params";
import ResponseMessage from "../interfaces/ResponseMessage";
import {PlanDayForm} from "../interfaces/PlanDay";
import { Request, Response } from "express";
import Plan from "../models/Plan";
import { Message } from "../enums/Message";
import PlanDay from "../models/PlanDay";


const createPlanDay = async(req:Request<Params, {}, PlanDayForm>, res:Response<ResponseMessage>) => {
    const id = req.params.id;
    const findPlan = await Plan.findById(id);   
    if(!findPlan || !Object.keys(findPlan).length) return res.status(404).send({msg: Message.DidntFind});
    const name = req.body.name;
    const exercises = req.body.exercises;
    if(!name || !exercises || !exercises.length) return res.status(400).send({msg: Message.FieldRequired});
    await PlanDay.create({
        plan: findPlan,
        name: name,
        exercises: exercises
    })
    return res.status(200).send({msg: Message.Created});
}

const updatePlanDay = async(req:Request<Params, {}, PlanDayForm>, res:Response<ResponseMessage>) => {
    const name = req.body.name;
    const exercises = req.body.exercises;
    if(!name || !exercises || !exercises.length) return res.status(400).send({msg: Message.FieldRequired});
    const id = req.body._id;
    if(!id) return res.status(400).send({msg: Message.DidntFind});
    const findPlanDay = await PlanDay.findById(id);
    if(!findPlanDay || !Object.keys(findPlanDay).length) return res.status(404).send({msg: Message.DidntFind});
    await findPlanDay.updateOne({name: name, exercises: exercises});
    return res.status(200).send({msg: Message.Updated});
}

const getPlanDay = async(req:Request<Params>, res:Response<PlanDayForm | ResponseMessage>) => {
    const id = req.params.id;
    const findPlanDay = await PlanDay.findById(id);
    if(!findPlanDay || !Object.keys(findPlanDay).length) return res.status(404).send({msg: Message.DidntFind});
    const planDay = {
        _id: findPlanDay._id,
        name: findPlanDay.name,
        exercises: findPlanDay.exercises
    }
    return res.status(200).send(planDay);
}

export{createPlanDay, updatePlanDay, getPlanDay}
