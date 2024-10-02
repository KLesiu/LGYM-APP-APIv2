import { Request, Response } from "express";
import Plan from "../models/Plan";
import Params from "../interfaces/Params";
import ResponseMessage from "../interfaces/ResponseMessage";
import {
  PlanForm,
} from "../interfaces/Plan";
import User from "../models/User";
import { Message } from "../enums/Message";
require("dotenv").config();

const createPlan = async (
  req: Request<Params, {}, PlanForm>,
  res: Response<ResponseMessage>
) => {
  const id = req.params.id;
  const findUser = await User.findById(id);
  if (!findUser || !Object.keys(findUser).length)
    return res.status(404).send({ msg: Message.DidntFind });
  const days = req.body.trainingDays;
  const name = req.body.name;
  if (!name || !days)
    return res.status(400).send({ msg: Message.FieldRequired });
  if (days < 1 || days > 7) return res.send({ msg: Message.ChooseDays });
  const currentPlan = await Plan.create({
    user: findUser,
    name: name,
    trainingDays: days,
  });
  await findUser.updateOne({ plan: currentPlan });
  return res.status(200).send({ msg: Message.Created });
};
const updatePlan = async (
  req: Request<Params, {}, PlanForm>,
  res: Response<ResponseMessage>
) => {
  const days = req.body.trainingDays;
  const name = req.body.name;
  if (!name || !days)
    return res.status(400).send({ msg: Message.FieldRequired });
  if (days < 1 || days > 7) return res.send({ msg: Message.ChooseDays });
  const findPlan = await Plan.findById(req.body._id);
  if (!findPlan || !Object.keys(findPlan).length)
    return res.status(404).send({ msg: Message.DidntFind });
  await findPlan.updateOne({ name: name, trainingDays: days });
  return res.status(200).send({ msg: Message.Updated });
};

const getPlanConfig = async (req: Request<Params>, res: Response<PlanForm | ResponseMessage>) => {
  const id = req.params.id;
  const findUser = await User.findById(id);
  if (!findUser || !Object.keys(findUser).length)
    return res.status(404).send({ msg: Message.DidntFind });
  const findPlan = await Plan.findOne({ user: findUser });
  if (!findPlan || !Object.keys(findPlan).length)
    return res.status(404).send({ msg: Message.DidntFind });
  const planConfig = {
    _id: findPlan._id,
    name: findPlan.name,
    trainingDays: findPlan.trainingDays,
  };
  return res.status(200).send(planConfig);
};

const checkIsUserHavePlan = async(req:Request<Params>, res:Response<boolean>) => {
  const id = req.params.id;
  const findUser = await User.findById(id);
  if(!findUser || !Object.keys(findUser).length) return res.status(404).send(false);
  const plan = await Plan.find({user: findUser});
  if(!plan || !plan.length) return res.status(200).send(false);
  return res.status(200).send(true);
}

export { createPlan, updatePlan,getPlanConfig,checkIsUserHavePlan };
