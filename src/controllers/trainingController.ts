require("dotenv").config();
import { Request, Response } from "express";
import Training from "../models/Training";
import Params from "../interfaces/Params";
import {
  LastTrainingInfo,
  TrainingHistoryQuery,
  TrainingByDate,
  TrainingByDateDetails,
} from "../interfaces/Training";
import ResponseMessage from "./../interfaces/ResponseMessage";
import User from "./../models/User";
import { Message } from "../enums/Message";
import { TrainingForm } from "../interfaces/Training";
import { addExercisesScores } from "./exercisesScoresController";
import { ExerciseScoresForm } from "../interfaces/ExercisesScores";
import ExerciseScores from "../models/ExerciseScores";
import Exercise from "../models/Exercise";
import { ExerciseScoresTrainingForm } from "../interfaces/ExercisesScores";

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
        training.exercises.map(
          async (exercise: { exerciseScoreId: string }) => {
            const scoreDetails = await ExerciseScores.findById(
              exercise.exerciseScoreId,
              "exercise reps series weight unit"
            );

            const exerciseDetails = await Exercise.findById(
              scoreDetails.exercise,
              "name bodyPart"
            );

            return {
              exerciseScoreId: exercise.exerciseScoreId,
              scoreDetails,
              exerciseDetails,
            };
          }
        )
      );

      // Grupa scoreDetails po exercise
      const groupedExercises = enrichedExercises.reduce(
        (acc: any, curr: any) => {
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
        },
        {}
      );

      // Konwersja obiektu na tablicę
      const exercisesArray = Object.values(groupedExercises);

      return { ...training, exercises: exercisesArray };
    })
  );

  return res.status(200).send(enrichedTrainings);
};

const getTrainingDates = async (
  req: Request<Params>,
  res: Response<Date[] | ResponseMessage>
) => {
  const trainings = await Training.find(
    { user: req.params.id },
    "createdAt"
  ).sort({ createdAt: 1 });
  if (!trainings || !trainings.length)
    return res.status(404).send({ msg: Message.DidntFind });
  const dates = trainings.map((ele: { createdAt: Date }) => ele.createdAt);
  return res.status(200).send(dates);
};

const calculateEloPerExercise = async (
  currentExerciseScore: ExerciseScoresTrainingForm,
  user: string
): Promise<number> => {
  const prevCurrentExerciseScore = await ExerciseScores.find({
    exercise: currentExerciseScore.exercise,
    series: currentExerciseScore.series,
    user: user,
  })
    .sort({ createdAt: -1 })
    .limit(1);
  let elo:number;
  if (!prevCurrentExerciseScore || !prevCurrentExerciseScore.length) elo = partElo(0, 0, currentExerciseScore.weight, currentExerciseScore.reps);
  else elo = partElo(
    prevCurrentExerciseScore[0].weight,
    prevCurrentExerciseScore[0].reps,
    currentExerciseScore.weight,
    currentExerciseScore.reps,
  );
  return elo;
};

const partElo = (
  prev_weight: number,
  prev_reps: number,
  acc_weight: number,
  acc_reps: number,
): number => {
  const K = 32;

  const getWeightedScore = (weight: number, reps: number): number => {
    if (weight <= 15) {
      return (weight * 0.3) + (reps * 0.7); 
    } else if (weight <= 80) {
      return (weight * 0.5) + (reps * 0.5);
    } else {
      return (weight * 0.7) + (reps * 0.3);
    }
  };

  const prev_score = getWeightedScore(prev_weight, prev_reps);
  const acc_score = getWeightedScore(acc_weight, acc_reps);

  const toleranceThreshold = prev_weight > 80 ? 0.1 * prev_score : 0.05 * prev_score;

  let expectedScore;
  if (Math.abs(acc_score - prev_score) <= toleranceThreshold) {
    expectedScore = 0.5; 
  } else {
    expectedScore = prev_score / (prev_score + acc_score);
  }

  const actualScore = acc_score >= prev_score ? 1 : 0;

  const scoreDifference = (actualScore - expectedScore) * (Math.abs(acc_score - prev_score) < toleranceThreshold ? 0.5 : 1);
  const points =  K * scoreDifference;

  return Math.round(points);
};

export {
  addTraining,
  getLastTraining,
  getTrainingHistory,
  getTrainingByDate,
  getTrainingDates,
};
