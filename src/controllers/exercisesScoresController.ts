import {
  ExerciseScoresChartData,
  ExerciseScoresForm,
} from "../interfaces/ExercisesScores";
import Params from "../interfaces/Params";
import ExerciseScores, { ExerciseScoresEntity } from "../models/ExerciseScores";
import { Request, Response } from "express";
import User from "../models/User";
import { Message } from "../enums/Message";
import ResponseMessage from "../interfaces/ResponseMessage";
import Exercise from "../models/Exercise";
import calculateOneRepMax from "../helpers/OneRepMaxHelper";

const addExercisesScores = async (form: ExerciseScoresForm) => {
  const result = await ExerciseScores.create(form);
  return { exerciseScoreId: result._id as string };
};

const updateExercisesScores = async (form: ExerciseScoresForm) => {
  const result = await ExerciseScores.findByIdAndUpdate(form._id, form);
  if (!result) return { exerciseScoreId: "" };
  return { exerciseScoreId: result._id as string };
};

const getExerciseScoresChartData = async (
  req: Request<Params, {}, { exerciseId: string }>,
  res: Response<ExerciseScoresChartData[] | ResponseMessage>
) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send({ msg: Message.DidntFind });
  }

  const exerciseScores = await ExerciseScores.find({
    user: req.params.id,
    exercise: req.body.exerciseId,
  })
    .sort({ createdAt: 1 })
    .populate("training", "createdAt")
    .populate("exercise", "name");

  const bestSeries: Record<
    string,
    {
      reps: number;
      weight: number;
      oneRepMax: number;
      exerciseName: string;
      trainingDate: string;
    }
  > = {};

  exerciseScores.forEach((score: any) => {
    const key = `${score.exercise._id}-${score.training._id}`;
    const oneRepMax = calculateOneRepMax(score.reps, score.weight);
    const trainingDate = new Intl.DateTimeFormat("en-US", {
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(score.training.createdAt));

    if (!bestSeries[key] || oneRepMax > bestSeries[key].oneRepMax) {
      bestSeries[key] = {
        reps: score.reps,
        weight: score.weight,
        oneRepMax,
        exerciseName: score.exercise.name,
        trainingDate,
      };
    }
  });

  const result: ExerciseScoresChartData[] = Object.entries(bestSeries).map(
    ([key, best]) => ({
      _id: key,
      value: best.oneRepMax,
      date: best.trainingDate,
      exerciseName: best.exerciseName,
      exerciseId: key.split("-")[0],
    })
  );

  return res.status(200).send(result);
};

export {
  addExercisesScores,
  updateExercisesScores,
  getExerciseScoresChartData,
};
