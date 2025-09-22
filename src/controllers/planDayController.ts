import Params from "../interfaces/Params";
import ResponseMessage from "../interfaces/ResponseMessage";
import {
  PlanDayForm,
  PlanDayVm,
  PlanDayExercise,
  PlanDayChoose,
  PlanDayBaseInfoVm,
  PlanDayExercisesFormVm,
} from "../interfaces/PlanDay";
import { Request, Response } from "express";
import Plan from "../models/Plan";
import { Message } from "../enums/Message";
import PlanDay, { PlanDayEntity } from "../models/PlanDay";
import User from "../models/User";
import Exercise from "../models/Exercise";
import { ExerciseForm } from "../interfaces/Exercise";
import Training from "../models/Training";

const createPlanDay = async (
  req: Request<Params, {}, PlanDayForm>,
  res: Response<ResponseMessage>
) => {
  const id = req.params.id;
  const findPlan = await Plan.findById(id);
  if (!findPlan || !Object.keys(findPlan).length)
    return res.status(404).send({ msg: Message.DidntFind });
  const name = req.body.name;
  const exercises = req.body.exercises;
  if (!name || !exercises || !exercises.length)
    return res.status(400).send({ msg: Message.FieldRequired });
  await PlanDay.create({
    plan: findPlan,
    name: name,
    exercises: exercises,
    isDeleted: false,
  });
  return res.status(200).send({ msg: Message.Created });
};

const updatePlanDay = async (
  req: Request<Params, {}, PlanDayForm>,
  res: Response<ResponseMessage>
) => {
  const name = req.body.name;
  const exercises = req.body.exercises;
  if (!name || !exercises || !exercises.length)
    return res.status(400).send({ msg: Message.FieldRequired });
  const id = req.body._id;
  if (!id) return res.status(400).send({ msg: Message.DidntFind });
  const findPlanDay = await PlanDay.findById(id);
  if (!findPlanDay || !Object.keys(findPlanDay).length)
    return res.status(404).send({ msg: Message.DidntFind });
  await findPlanDay.updateOne({ name: name, exercises: exercises });
  return res.status(200).send({ msg: Message.Updated });
};

const getPlanDay = async (
  req: Request<Params>,
  res: Response<PlanDayVm | ResponseMessage>
) => {
  const id = req.params.id;
  const findPlanDay = await PlanDay.findById(id);
  if (!findPlanDay || !Object.keys(findPlanDay).length)
    return res.status(404).send({ msg: Message.DidntFind });
  const exercises = await Promise.all(
    findPlanDay.exercises.map(async (exercise: PlanDayExercise) => {
      const findExercise = await Exercise.findById(exercise.exercise);
      return {
        series: exercise.series,
        reps: exercise.reps,
        exercise: findExercise as ExerciseForm,
      };
    })
  );

  const planDay = {
    _id: findPlanDay._id,
    name: findPlanDay.name,
    exercises: exercises.length ? exercises : [] as PlanDayExercisesFormVm[],
  };
  return res.status(200).send(planDay);
};

const getPlanDays = async (
  req: Request<Params>,
  res: Response<PlanDayVm[] | ResponseMessage>
) => {
  const id = req.params.id;

  const findPlan = await Plan.findById(id);
  if (!findPlan || !Object.keys(findPlan).length) {
    return res.status(404).send({ msg: Message.DidntFind });
  }

  const findPlanDays = await PlanDay.find({ plan: findPlan, isDeleted: false });
  if (!findPlanDays || !findPlanDays.length) {
    return res.status(404).send({ msg: Message.DidntFind });
  }

  const planDays = await Promise.all(
    findPlanDays.map(async (planDay: PlanDayEntity) => {
      const exercises = await Promise.all(
        planDay.exercises.map(async (exercise) => {
          const findExercise = await Exercise.findById(exercise.exercise);
          return {
            series: exercise.series,
            reps: exercise.reps,
            exercise: findExercise!,
          };
        })
      );

      return {
        _id: planDay._id,
        name: planDay.name,
        exercises: exercises,
      };
    })
  );

  return res.status(200).send(planDays);
};

const getPlanDaysInfo = async (
  req: Request<Params>,
  res: Response<PlanDayBaseInfoVm[] | ResponseMessage>
) => {
  const id = req.params.id;
  const findPlan = await Plan.findById(id);
  if (!findPlan || !Object.keys(findPlan).length) {
    return res.status(404).send({ msg: Message.DidntFind });
  }

  const findPlanDays = await PlanDay.find({ plan: findPlan, isDeleted: false });
  if (!findPlanDays || !findPlanDays.length) {
    return res.status(404).send({ msg: Message.DidntFind });
  }
  const planDaysWithTrainingDate = (await Promise.all(
    findPlanDays.map(async (planDay) => {
      const lastTraining = await Training.findOne({ type: planDay._id })
        .sort({ createdAt: -1 })
        .select("createdAt");

      return {
        _id: planDay._id,
        name: planDay.name,
        lastTrainingDate: lastTraining?.createdAt,
        totalNumberOfSeries: planDay.exercises.reduce(
          (acc, curr) => acc + curr.series,
          0
        ),
        totalNumberOfExercises: planDay.exercises.length,
      };
    })
  )) as PlanDayBaseInfoVm[];

  return res.status(200).send(planDaysWithTrainingDate);
};

const getPlanDaysTypes = async (
  req: Request<Params>,
  res: Response<PlanDayChoose[] | ResponseMessage>
) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user || !Object.keys(user).length)
    return res.status(404).send({ msg: Message.DidntFind });
  const plan = await Plan.findOne({ user: user, isActive: true });
  if (!plan)
    return res.status(404).send({ msg: Message.DidntFind });
  const planDaysTypes = await PlanDay.find(
    { plan: plan, isDeleted: false },
    "_id name"
  );
  return res.status(200).send(planDaysTypes);
};

const deletePlanDay = async (
  req: Request<Params>,
  res: Response<ResponseMessage>
) => {
  const id = req.params.id;
  const findPlanDay = await PlanDay.findById(id);
  if (!findPlanDay || !Object.keys(findPlanDay).length)
    return res.status(404).send({ msg: Message.DidntFind });
  await findPlanDay.updateOne({ isDeleted: true });
  return res.status(200).send({ msg: Message.Deleted });
};

export {
  createPlanDay,
  updatePlanDay,
  getPlanDay,
  getPlanDays,
  getPlanDaysTypes,
  deletePlanDay,
  getPlanDaysInfo
};
