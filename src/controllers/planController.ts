import { Request, Response } from "express";
import Plan from "../models/Plan";
import Params from "../interfaces/Params";
import ResponseMessage from "../interfaces/ResponseMessage";
import { PlanForm } from "../interfaces/Plan";
import User, { UserEntity } from "../models/User";
import { Message } from "../enums/Message";
import { Types } from "mongoose";
import PlanDay, { PlanDayEntity } from "../models/PlanDay";
import Exercise, { ExerciseEntity } from "../models/Exercise";
import { ExerciseForm, ExerciseToCopy } from "../interfaces/Exercise";
import generateCode from "../config/nanoid";

require("dotenv").config();

const createPlan = async (
  req: Request<Params, {}, PlanForm>,
  res: Response<ResponseMessage>
) => {
  const id = req.params.id;
  const findUser = await User.findById(id);
  if (!findUser || !Object.keys(findUser).length)
    return res.status(404).send({ msg: Message.DidntFind });
  const name = req.body.name;
  const currentPlan = await Plan.create({
    user: findUser,
    name: name,
    isActive: true,
  });
  await findUser.updateOne({ plan: currentPlan });
  return res.status(200).send({ msg: Message.Created });
};
const updatePlan = async (
  req: Request<Params, {}, PlanForm>,
  res: Response<ResponseMessage>
) => {
  const name = req.body.name;
  if (!name) return res.status(400).send({ msg: Message.FieldRequired });
  const findPlan = await Plan.findById(req.body._id);
  if (!findPlan || !Object.keys(findPlan).length)
    return res.status(404).send({ msg: Message.DidntFind });
  await findPlan.updateOne({ name: name });
  return res.status(200).send({ msg: Message.Updated });
};

const getPlanConfig = async (
  req: Request<Params>,
  res: Response<PlanForm | ResponseMessage>
) => {
  const id = req.params.id;
  const findUser = await User.findById(id);
  if (!findUser || !Object.keys(findUser).length)
    return res.status(404).send({ msg: Message.DidntFind });
  const findPlan = await Plan.findOne({ user: findUser,isActive:true });
  if (!findPlan || !Object.keys(findPlan).length)
    return res.status(404).send({ msg: Message.DidntFind });
  const planConfig = {
    _id: findPlan._id,
    name: findPlan.name,
    isActive: findPlan.isActive,
    shareCode: findPlan.shareCode
  };
  return res.status(200).send(planConfig);
};

const checkIsUserHavePlan = async (
  req: Request<Params>,
  res: Response<boolean>
) => {
  const id = req.params.id;
  const findUser = await User.findById(id);
  if (!findUser || !Object.keys(findUser).length)
    return res.status(404).send(false);
  const plan = await Plan.findOne({ user: findUser ,isActive:true});
  if (!plan ) return res.status(200).send(false);
  const planDay = await PlanDay.findOne({plan:plan._id,isDeleted:false})
  if(!planDay) return res.status(200).send(false)
  return res.status(200).send(true);
};

const getPlansList = async (
  req: Request<Params>,
  res: Response<PlanForm[] | ResponseMessage>
) => {
  const userId = req.params.id;
  const findUser = await User.findById(userId);
  if (!findUser || !Object.keys(findUser).length)
    return res.status(404).send({ msg: Message.DidntFind });
  const plans = await Plan.find({ user: findUser });
  if (!plans || !plans.length)
    return res.status(404).send({ msg: Message.DidntFind });
  const plansList = plans.map((plan) => ({
    _id: plan._id,
    name: plan.name,
    isActive: plan.isActive,
  }));
  return res.status(200).send(plansList);
};

const setNewActivePlan = async (
  req: Request<Params, {}, PlanForm>,
  res: Response<ResponseMessage>
) => {
  const userId = req.params.id;
  const planId = req.body._id;

  await Plan.updateMany(
    { user: userId, _id: { $ne: planId } },
    { $set: { isActive: false } }
  );

  await Plan.updateOne(
    { user: userId, _id: planId },
    { $set: { isActive: true } }
  );

  return res.status(200).send({ msg: Message.Updated });
};

const copyPlan = async (
  req: Request<{}, {}, { shareCode: string }>,
  res: Response<ResponseMessage>)=>{
    const userId = req.user?._id;
    if(!userId) return res.status(401).send({msg:Message.Unauthorized});
    const { shareCode } = req.body;

    const planToCopy = await Plan.findOne({shareCode: shareCode});
    if(!planToCopy) return res.status(404).send({msg: Message.DidntFind});
    const planDaysToCopy = await PlanDay.find({plan: planToCopy._id, isDeleted: false});
    const newPlan = new Plan({
      user: req.user!.id,
      name: planToCopy.name,
      isActive: true,
    })
    const userExerciseToAdd = [] as ExerciseEntity[]
    const planDaysToAdd = [] as PlanDayEntity[]
    for(const planDay of planDaysToCopy){
      const exercisesToPlanDay = []
      for(const exercise of planDay.exercises){
        const findExercise = await Exercise.findById(exercise.exercise);
        if(findExercise && findExercise.user){
          const exerciseToAdd = new Exercise({
            name: findExercise.name,
            user: req.user!.id,
            bodyPart: findExercise.bodyPart,
            description: findExercise.description,
            image: findExercise.image
          }) 
          exercisesToPlanDay.push({
            series: exercise.series,
            reps: exercise.reps,
            exercise: exerciseToAdd._id})
          userExerciseToAdd.push(exerciseToAdd);
        }else{
          exercisesToPlanDay.push({
            series: exercise.series,
            reps: exercise.reps,
            exercise: exercise.exercise})
        }
      }
      const planDayToAdd = new PlanDay({
        name: planDay.name,
        plan: newPlan._id,
        exercises: exercisesToPlanDay})
      planDaysToAdd.push(planDayToAdd);
    }
    await newPlan.save();
    await Exercise.create(userExerciseToAdd)
    await PlanDay.create(planDaysToAdd);
    return res.status(200).send({msg: Message.Created});      
  }

const generateShareCode = async (req:Request<{},{},{planId:string}>,res:Response<string | ResponseMessage>)=>{
  const plansCodes = await Plan.find().select("shareCode")
  const codesArray = plansCodes.map(plan=>plan.shareCode)
  const regenerateCode = ():string => {
      const newCode = generateCode()
      if(codesArray.includes(newCode))return regenerateCode()
      return newCode
  }
  const {planId} = req.body
  const code = regenerateCode()
  await Plan.updateOne({_id:planId},{shareCode:code})
  return res.status(200).send(code)
}



export {
  createPlan,
  updatePlan,
  getPlanConfig,
  checkIsUserHavePlan,
  getPlansList,
  setNewActivePlan,
  copyPlan,
  generateShareCode
};
