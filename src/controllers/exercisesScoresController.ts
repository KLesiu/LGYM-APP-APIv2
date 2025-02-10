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
    req: Request<Params,{},{exerciseId:string}>,
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
      const options: Intl.DateTimeFormatOptions = { month: "2-digit", day: "2-digit" };

    const result = exerciseScores.map((score: any) => ({
      _id: score._id,
      value: score.weight,
      date: new Intl.DateTimeFormat("en-US", options).format(new Date(score.training.createdAt)), 
      exerciseName: score.exercise.name, 
      exerciseId: score.exercise._id, 
    }));
  
    return res.status(200).send(result);
  };
  

export { addExercisesScores, updateExercisesScores,getExerciseScoresChartData };
