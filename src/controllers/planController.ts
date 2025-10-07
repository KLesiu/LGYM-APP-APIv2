import { Request, Response } from "express";
import Plan from "../models/Plan";
import Params from "../interfaces/Params";
import ResponseMessage from "../interfaces/ResponseMessage";
import { PlanForm } from "../interfaces/Plan";
import User from "../models/User";
import { Message } from "../enums/Message";
import { Types } from "mongoose";
import PlanDay from "../models/PlanDay";

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

export {
  createPlan,
  updatePlan,
  getPlanConfig,
  checkIsUserHavePlan,
  getPlansList,
  setNewActivePlan
};
