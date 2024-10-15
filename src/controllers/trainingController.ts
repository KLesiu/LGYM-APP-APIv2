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
  TrainingHistoryQuery,
  TrainingByDate,
  TrainingByDateDetails,
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
import ExerciseScores from "../models/ExerciseScores";
import Exercise from "../models/Exercise";

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

const getTrainingHistory = async (
  req: Request<Params, {}, TrainingHistoryQuery>,
  res: Response<TrainingForm[] | ResponseMessage>
) => {
  const id = req.params.id;
  const findUser = await User.findById(id);
  if (!findUser || !Object.keys(findUser).length)
    return res.status(404).send({ msg: Message.DidntFind });
  const { startDt, endDt } = req.body;

  try {
    const trainingHistory = await Training.find({
      user: findUser,
      createdAt: {
        $gte: new Date(startDt),
        $lte: new Date(endDt),
      },
    }).sort({ date: -1 });

    return res.status(200).send(trainingHistory);
  } catch (error) {
    return res.status(500).send({ msg: Message.TryAgain });
  }
};


const getTrainingByDate = async (
    req: Request<Params, {}, { createdAt: Date }>,
    res: Response<TrainingByDateDetails[] | ResponseMessage>
  ) => {
    const id = req.params.id;
    const findUser = await User.findById(id);
    if (!findUser || !Object.keys(findUser).length)
      return res.status(404).send({ msg: Message.DidntFind });
  
    const { createdAt } = req.body;
    const startOfDay = new Date(createdAt);
    startOfDay.setHours(0, 0, 0, 0);
  
    const endOfDay = new Date(createdAt);
    endOfDay.setHours(23, 59, 59, 999);
  
    const trainings = await Training.aggregate([
      {
        $match: {
          user: findUser._id,
          createdAt: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
        },
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
          exercises: 1,
          createdAt: 1,
          "planDay.name": 1,
        },
      },
    ]);
  
    if (!trainings.length) {
      return res.status(404).send({ msg: Message.DidntFind });
    }
  
    const enrichedTrainings = await Promise.all(
      trainings.map(async (training: TrainingByDate) => {
        const enrichedExercises = await Promise.all(
          training.exercises.map(async (exercise: { exerciseScoreId: string }) => {
            const scoreDetails = await ExerciseScores.findById(
              exercise.exerciseScoreId,
              "exercise reps series weight unit"
            );
  
            const exerciseDetails = await Exercise.findById(scoreDetails.exercise, "name bodyPart");
  
            return {
              exerciseScoreId: exercise.exerciseScoreId,
              scoreDetails,
              exerciseDetails,
            };
          })
        );
  
        // Grupa scoreDetails po exercise
        const groupedExercises = enrichedExercises.reduce((acc: any, curr: any) => {
          const exerciseId = curr.scoreDetails.exercise;
          if (!acc[exerciseId]) {
            acc[exerciseId] = {
              exerciseScoreId: curr.exerciseScoreId,
              exerciseDetails: curr.exerciseDetails,
              scoresDetails: [],
            };
          }
          acc[exerciseId].scoresDetails.push(curr.scoreDetails);
          return acc;
        }, {});
  
        // Konwersja obiektu na tablicę
        const exercisesArray = Object.values(groupedExercises);
  
        return { ...training, exercises: exercisesArray };
      })
    );
  
    return res.status(200).send(enrichedTrainings);
  };


const getTrainingDates = async (req:Request<Params>,res:Response<Date[] | ResponseMessage>) => {
  const trainings = await Training.find({user:req.params.id},'createdAt').sort({createdAt:1});
  if(!trainings || !trainings.length) return res.status(404).send({msg:Message.DidntFind});
  const dates = trainings.map((ele:{createdAt:Date})=>ele.createdAt);
  return res.status(200).send(dates);
  
}
  

export { addTraining, getLastTraining, getTrainingHistory, getTrainingByDate,getTrainingDates };
