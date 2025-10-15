require("dotenv").config();
import { Request, Response } from "express";
import Training from "../models/Training";
import Params from "../interfaces/Params";
import {
  LastTrainingInfo,
  TrainingByDate,
  TrainingByDateDetails,
  TrainingSummary,
  EnrichedExercise,
  SeriesComparison,
  GroupedExerciseComparison,
} from "../interfaces/Training";
import ResponseMessage from "./../interfaces/ResponseMessage";
import User, { UserEntity } from "./../models/User";
import { Message } from "../enums/Message";
import { TrainingForm } from "../interfaces/Training";
import { addExercisesScores } from "./exercisesScoresController";
import { ExerciseScoresForm } from "../interfaces/ExercisesScores";
import ExerciseScores, { ExerciseScoresEntity } from "../models/ExerciseScores";
import Exercise from "../models/Exercise";
import { ExerciseScoresTrainingForm } from "../interfaces/ExercisesScores";
import { SeriesScore } from "../interfaces/Exercise";
import { updateUserElo } from "./userController";
import EloRegistry from "../models/EloRegistry";
import Gym from "../models/Gym";
import mongoose from "mongoose";

const addTraining = async (
  req: Request<Params, {}, TrainingForm>,
  res: Response<ResponseMessage | TrainingSummary>
) => {
  try {
    const userId = req.params.id;
    const {
      type,
      createdAt,
      gym: gymId,
      exercises: currentExercises,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).send({ msg: Message.DidntFind });
    const gym = await Gym.findById(gymId);
    if (!gym) return res.status(404).send({ msg: Message.DidntFind });

    const trainingRecord = await Training.create({
      user: userId,
      type,
      createdAt,
      gym: gymId,
    });
    if (!trainingRecord) return res.status(404).send({ msg: Message.TryAgain });

    const uniqueExerciseIds = [
      ...new Set(currentExercises.map((e) => e.exercise)),
    ];

    const [exerciseDetailsMap, previousScoresMap] = await Promise.all([
      fetchExerciseDetails(uniqueExerciseIds),
      fetchPreviousScores(userId, gymId, uniqueExerciseIds),
    ]);

    const exercisesToSave: ExerciseScoresForm[] = currentExercises.map((e) => ({
      ...e,
      training: trainingRecord._id,
      user: userId,
      date: createdAt,
    }));

    const { totalElo, savedScoreIds } = await processAndSaveScores(
      exercisesToSave,
      previousScoresMap
    );
    const exercisesToSaveAfterMap = savedScoreIds.map(ele=>{
      return {
        exerciseScoreId:ele
      }
    })
    await trainingRecord.updateOne({ exercises: exercisesToSaveAfterMap });
    const { rankStatus, oldElo } = await updateUserRankAndElo(
      userId,
      user,
      totalElo,
      trainingRecord._id
    );
    const comparison = buildComparisonReport(
      currentExercises,
      previousScoresMap,
      exerciseDetailsMap
    );


    return res.status(200).send({
      comparison,
      gainElo: totalElo,
      userOldElo: oldElo,
      profileRank: rankStatus.currentRank,
      nextRank: rankStatus.nextRank,
      msg: Message.Created,
    });
  } catch (error) {
    console.error("Błąd podczas dodawania treningu:", error);
    return res.status(500).send({ msg: Message.TryAgain });
  }
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
      $lookup: {
        from: "gyms",
        localField: "gym",
        foreignField: "_id",
        as: "gymDetails",
      },
    },
    {
      $unwind: {
        path: "$gymDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        type: 1,
        exercises: 1,
        createdAt: 1,
        "planDay.name": 1,
        gym: "$gymDetails.name", // Assuming the gym name is stored in the `name` field
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
            if (!exercise || !exercise.exerciseScoreId) return;
            const scoreDetails = await ExerciseScores.findById(
              exercise.exerciseScoreId,
              "exercise reps series weight unit"
            );
            if (!scoreDetails)
              return res.status(404).send({ msg: Message.DidntFind });
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
          if (!curr || !curr.scoreDetails) return acc;
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

      const exercisesArray: EnrichedExercise[] =
        Object.values(groupedExercises);

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
  currentExerciseScore: ExerciseScoresForm,
  lastExerciseScore: SeriesScore
): Promise<number> => {
  let elo: number;
  if (!lastExerciseScore || !lastExerciseScore.score) elo = 0;
  else
    elo = partElo(
      lastExerciseScore.score.weight,
      lastExerciseScore.score.reps,
      currentExerciseScore.weight,
      currentExerciseScore.reps
    );
  return elo;
};

const partElo = (
  prev_weight: number,
  prev_reps: number,
  acc_weight: number,
  acc_reps: number
): number => {
  const K = 32;

  const getWeightedScore = (weight: number, reps: number): number => {
    if (weight <= 15) {
      return weight * 0.3 + reps * 0.7;
    } else if (weight <= 80) {
      return weight * 0.5 + reps * 0.5;
    } else {
      return weight * 0.7 + reps * 0.3;
    }
  };

  const prev_score = getWeightedScore(prev_weight, prev_reps);
  const acc_score = getWeightedScore(acc_weight, acc_reps);

  const toleranceThreshold =
    prev_weight > 80 ? 0.1 * prev_score : 0.05 * prev_score;

  let expectedScore;
  if (Math.abs(acc_score - prev_score) <= toleranceThreshold) {
    expectedScore = 0.5;
  } else {
    expectedScore = prev_score / (prev_score + acc_score);
  }

  const actualScore = acc_score >= prev_score ? 1 : 0;

  const scoreDifference =
    (actualScore - expectedScore) *
    (Math.abs(acc_score - prev_score) < toleranceThreshold ? 0.5 : 1);
  const points = K * scoreDifference;

  return Math.round(points);
};

const fetchExerciseDetails = async (
  exerciseIds: string[]
): Promise<Map<string, string>> => {
  const exercises = await Exercise.find({ _id: { $in: exerciseIds } }).select(
    "name"
  );
  return new Map(exercises.map((e) => [e._id.toString(), e.name]));
};

const fetchPreviousScores = async (
  userId: string,
  gymId: string,
  exerciseIds: string[]
): Promise<Map<string, ExerciseScoresEntity>> => {
  const scores = await ExerciseScores.aggregate([
    {
      $lookup: {
        from: "trainings",
        localField: "training",
        foreignField: "_id",
        as: "trainingDetails",
      },
    },

    {
      $unwind: "$trainingDetails",
    },

    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        "trainingDetails.gym": new mongoose.Types.ObjectId(gymId),
        exercise: {
          $in: exerciseIds.map((id) => new mongoose.Types.ObjectId(id)),
        },
      },
    },

    { $sort: { createdAt: -1 } },

    {
      $group: {
        _id: { exercise: "$exercise", series: "$series" },
        lastScore: { $first: "$$ROOT" },
      },
    },

    {
      $project: {
        "lastScore.trainingDetails": 0,
      },
    },

    { $replaceRoot: { newRoot: "$lastScore" } },
  ]);

  return new Map(
    scores.map((score) => [
      `${score.exercise.toString()}-${score.series}`,
      score,
    ])
  );
};

const processAndSaveScores = async (
  exercises: ExerciseScoresForm[],
  previousScoresMap: Map<string, ExerciseScoresEntity>
) => {
  let totalElo = 0;
  const savedScoreIds: string[] = [];

  for (const exercise of exercises) {
    const key = `${exercise.exercise}-${exercise.series}`;
    const previousScore = previousScoresMap.get(key);

    if (previousScore) {
      const lastExerciseScores = {
        series: previousScore.series,
        score: {
          reps: previousScore.reps,
          weight: previousScore.weight,
          unit: previousScore.unit,
          _id: previousScore._id.toString(),
        },
      };
      totalElo += await calculateEloPerExercise(exercise, lastExerciseScores);
    }

    const savedScore = await addExercisesScores(exercise);
    savedScoreIds.push(savedScore.exerciseScoreId);
  }

  return { totalElo, savedScoreIds };
};

const buildComparisonReport = (
  currentExercises: TrainingForm["exercises"],
  previousScoresMap: Map<string, ExerciseScoresEntity>,
  exerciseDetailsMap: Map<string, string>
): GroupedExerciseComparison[] => {
  const comparisonMap = new Map<string, GroupedExerciseComparison>();

  for (const currentExercise of currentExercises) {
    const exerciseId = currentExercise.exercise;

    if (!comparisonMap.has(exerciseId)) {
      const exerciseName =
        exerciseDetailsMap.get(exerciseId) || "Nieznane ćwiczenie";
      comparisonMap.set(exerciseId, {
        exerciseId: exerciseId,
        exerciseName: exerciseName,
        seriesComparisons: [],
      });
    }

    const previousScore = previousScoresMap.get(
      `${exerciseId}-${currentExercise.series}`
    );

    const seriesComparison: SeriesComparison = {
      series: currentExercise.series,
      currentResult: {
        reps: currentExercise.reps,
        weight: currentExercise.weight,
        unit: currentExercise.unit,
      },
      previousResult: previousScore
        ? {
            reps: previousScore.reps,
            weight: previousScore.weight,
            unit: previousScore.unit,
          }
        : null,
    };

    comparisonMap.get(exerciseId)!.seriesComparisons.push(seriesComparison);
  }

  return Array.from(comparisonMap.values());
};

const updateUserRankAndElo = async (
  userId: string,
  user: UserEntity,
  eloGained: number,
  trainingId: string
) => {
  const currentUserElo = await EloRegistry.findOne({ user: userId }).sort({
    date: -1,
  });
  if (!currentUserElo)
    throw new Error("Nie znaleziono rekordu ELO użytkownika.");

  const rankStatus = await updateUserElo(
    eloGained,
    currentUserElo.elo,
    user,
    trainingId
  );
  return { rankStatus, oldElo: currentUserElo.elo };
};

export { addTraining, getLastTraining, getTrainingByDate, getTrainingDates };
