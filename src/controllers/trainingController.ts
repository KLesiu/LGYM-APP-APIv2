require("dotenv").config();
import { Request, Response } from "express";
import Training from "../models/Training";
import Plan from "../models/Plan";
import Params from "../interfaces/Params";
import {
  AddTrainingBody,
  TrainingHistory,
  Training as FoundTraining,
  TrainingSession,
  RankInfo,
  TrainingsDates,
  UserRanking,
  LastTrainingInfo,
} from "../interfaces/Training";
import ResponseMessage from "./../interfaces/ResponseMessage";
import User from "./../models/User";
import FieldScore from "./../interfaces/FieldScore";
import { compareDates } from "./../helpers/DatesHelpers";
import { ranks } from "./userController";
import { Message } from "../enums/Message";
import { TrainingForm } from "../interfaces/Training";
import { addExercisesScores } from "./exercisesScoresController";
import { ExerciseScoresForm } from "../interfaces/ExercisesScores";

const addTraining = async (
  req: Request<Params, {}, TrainingForm>,
  res: Response<ResponseMessage>
) => {
  const user = req.params.id;
  const planDay = req.body.type;
  const createdAt = req.body.createdAt;
  const response = await Training.create({
    user: user,
    type: planDay,
    createdAt: createdAt,
  });
  if (!response) return res.status(404).send({ msg: Message.TryAgain });
  const exercises: ExerciseScoresForm[] = req.body.exercises.map((ele) => {
    return { ...ele, training: response._id, user: user, date: createdAt };
  });
  const result: { exerciseScoreId: string }[] = await Promise.all(
    exercises.map((ele) => addExercisesScores(ele))
  );
  await response.updateOne({ exercises: result });
  return res.status(200).send({ msg: Message.Created });
};

const getLastTraining = async (
  req: Request<Params>,
  res: Response<LastTrainingInfo | ResponseMessage>
) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) return res.status(404).send({ msg: Message.DidntFind });
  const training = await Training.aggregate([
    {
      $match: { user: user._id },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $limit: 1,
    },
    {
      $lookup: {
        from: "plandays",
        localField: "type",
        foreignField: "_id",
        as: "planDay",
      },
    },
    {
      $unwind: "$planDay",
    },
    {
      $project: {
        type: 1,
        createdAt: 1,
        "planDay.name": 1,
      },
    },
  ]);

  if (!training) return res.status(404).send({ msg: Message.DidntFind });
  return res.status(200).send(training[0]);
};

export { addTraining, getLastTraining };
