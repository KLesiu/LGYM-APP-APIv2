import {
  ExerciseScoresBpDlSqChartData,
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

const getBpDlSqChartData = async (
    req: Request<Params>,
    res: Response<ExerciseScoresBpDlSqChartData[] | ResponseMessage>
  ) => {
    const allowedExercises = ["Squat", "Deadlift", "Bench Press"];
  
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ msg: Message.DidntFind });
    }
  
    const exercises = await Exercise.find({ name: { $in: allowedExercises },user:undefined });
  
    if (exercises.length === 0) {
      return res.status(404).send({ msg: "No exercises found" });
    }
  
    const exerciseIds = exercises.map(exercise => exercise._id);
  
    const exerciseScores = await ExerciseScores.find({
      user: req.params.id, 
      exercise: { $in: exerciseIds },
    })
      .sort({ createdAt: 1 }) 
      .populate("training", "createdAt") 
      .populate("exercise", "name"); 
  
    const result = exerciseScores.map((score: any) => ({
      _id: score._id,
      value: score.weight,
      date: score.training.createdAt,
      exerciseName: score.exercise.name, 
      exerciseId: score.exercise._id, 
    }));
  
    return res.status(200).send(result);
  };
  

export { addExercisesScores, updateExercisesScores,getBpDlSqChartData };
