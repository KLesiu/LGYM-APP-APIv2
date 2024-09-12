import { Request, Response } from "express";
import Plan from "../models/Plan";
import Params from "../interfaces/Params";
import ResponseMessage from "../interfaces/ResponseMessage";
import {
  DaysOfPlan,
  PlanSession,
  SharedPlan,
  PlanForm,
} from "../interfaces/Plan";
import User from "../models/User";
import { Message } from "../enums/Message";
import { updatePlan as updatePlanOld } from "../helpers/PlanHelpers";
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


export { createPlan, updatePlan,getPlanConfig };

exports.setPlanConfig = async (
  req: Request<Params, {}, PlanSession>,
  res: Response<ResponseMessage>
) => {
  const days = +(req.body.days as number);
  const name = req.body.name;
  const id = req.params.id;
  if (!name || !days) return res.send({ msg: Message.FieldRequired });
  if (days < 1 || days > 7) return res.send({ msg: Message.ChooseDays });
  const findUser = await User.findById(id);
  const currentPlan = await Plan.create({
    user: findUser,
    name: name,
    trainingDays: days,
  });
  await findUser.updateOne({ plan: currentPlan });
  return res.send({ msg: Message.Created });
};

const setPlanShared = async (user: typeof User, planConfig: SharedPlan) => {
  const currentPlan = await Plan.create({
    user: user,
    name: planConfig.name,
    trainingDays: planConfig.trainingDays,
  });
  await user.updateOne({ plan: currentPlan });
  const days = planConfig.days;
  const findPlan = await Plan.findOne({ user: user });
  await updatePlanOld(findPlan, planConfig.trainingDays, days);
};

exports.setPlan = async (
  req: Request<Params, {}, { days: DaysOfPlan }>,
  res: Response<ResponseMessage>
) => {
  const id = req.params.id;
  const findUser = await User.findById(id);
  const findPlan = await Plan.findOne({ user: findUser });
  const days = req.body.days.days;
  const result = await updatePlanOld(findPlan, days.length, days);
  return res.send(result);
};

exports.getPlan = async (
  req: Request<Params>,
  res: Response<{ data: PlanSession } | { data: string }>
) => {
  const id = req.params.id;
  const findUser = await User.findById(id);
  const findPlan = await Plan.findOne({ user: findUser });
  if (findPlan)
    return res
      .status(200)
      .send({
        data: {
          planA: findPlan.planA,
          planB: findPlan.planB,
          planC: findPlan.planC,
          planD: findPlan.planD,
          planE: findPlan.planE,
          planF: findPlan.planF,
          planG: findPlan.planG,
        },
      });
  else return res.status(404).send({ data: Message.DidntFind });
};

exports.deletePlan = async (
  req: Request<Params>,
  res: Response<ResponseMessage>
) => {
  const id = req.params.id;
  const findUser = await User.findById(id);
  const deletedPlan = await Plan.findOneAndDelete({ user: findUser });
  await findUser.updateOne({ $unset: { plan: 1 } }, { new: true });
  if (deletedPlan) return res.status(200).send({ msg: Message.Deleted });
  else return res.status(404).send({ msg: Message.DidntFind });
};

exports.getSharedPlan = async (
  req: Request<Params>,
  res: Response<ResponseMessage>
) => {
  const user = await User.findById(req.params.id);
  const name = req.body.userName;
  const findUser = await User.findOne({ name: name });
  if (!findUser || name === user.name) return;
  const userPlan = await Plan.findOne({ user: findUser });
  const sharedPlan = {
    name: userPlan.name,
    days: [
      { exercises: userPlan.planA },
      { exercises: userPlan.planB },
      { exercises: userPlan.planC },
      { exercises: userPlan.planD },
      { exercises: userPlan.planE },
      { exercises: userPlan.planF },
      { exercises: userPlan.planG },
    ],
    trainingDays: userPlan.trainingDays,
  };

  await setPlanShared(user, sharedPlan);
  return res.status(200).send({ msg: "Added" });
};
