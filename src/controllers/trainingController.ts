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
} from "../interfaces/Training";
import ResponseMessage from "./../interfaces/ResponseMessage";
import User from "./../models/User";
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
import { findExerciseScore } from "../services/ExerciseScoresService";
const addTraining = async (
  req: Request<Params, {}, TrainingForm>,
  res: Response<ResponseMessage | TrainingSummary>
) => {
  const userId = req.params.id;
  const planDay = req.body.type;
  const createdAt = req.body.createdAt;
  const gymId = req.body.gym;

  const user = await User.findById(userId);
  if (!user) return res.status(404).send({ msg: Message.DidntFind });
  const gym = await Gym.findById(gymId);
  if (!gym) return res.status(404).send({ msg: Message.DidntFind });
  // Tworzenie rekordu treningu
  const response = await Training.create({
    user: userId,
    type: planDay,
    createdAt: createdAt,
    gym: req.body.gym,
  });

  if (!response) return res.status(404).send({ msg: Message.TryAgain });

  const exercisesNames = [] as { exerciseName: string; exerciseId: string }[];

  for (const exercise of req.body.exercises) {
    if (exercisesNames.find((ele) => ele.exerciseId === exercise.exercise))
      continue;
    const exerciseDetails = await Exercise.findById(exercise.exercise);
    if (!exerciseDetails) {
      return res.status(404).send({ msg: Message.DidntFind });
    }
    exercisesNames.push({
      exerciseName: exerciseDetails.name,
      exerciseId: exerciseDetails._id.toString(),
    });
  }


  // Pobieranie ćwiczeń i dodawanie wyników dla każdego z nich
  const exercises: ExerciseScoresForm[] = req.body.exercises.map((ele) => {
    return { ...ele, training: response._id, user: userId, date: createdAt };
  });

  const findLastExercisesScoresArray: ExerciseScoresEntity[] = [];

  // Tworzymy tablicę na wyniki ćwiczeń wraz z obliczonym ELO
  const result = await Promise.all(
    exercises.map(async (ele) => {
      const findLastExerciseSeriesScore = await findExerciseScore(
        gymId,
        userId,
        ele.exercise,
        ele.series
      );
      let elo = 0;
      if (findLastExerciseSeriesScore) {
        findLastExercisesScoresArray.push(findLastExerciseSeriesScore);
        // Obliczanie ELO dla każdego ćwiczenia
        const lastExerciseScores: SeriesScore | undefined = {
          series: findLastExerciseSeriesScore.series,
          score: {
            reps: findLastExerciseSeriesScore.reps,
            weight: findLastExerciseSeriesScore.weight,
            unit: findLastExerciseSeriesScore.unit,
            _id: findLastExerciseSeriesScore._id.toString(),
          },
        };
        elo = await calculateEloPerExercise(ele, lastExerciseScores);
      }
      // Dodanie wyniku ćwiczenia z obliczonym ELO
      const exerciseScoreId = await addExercisesScores(ele);

      return { exerciseScoreId, elo };
    })
  );

  let elo = 0;
  result.forEach(
    (
      ele:
        | { elo: number; exerciseScoreId: { exerciseScoreId: string } }
        | undefined
    ) => {
      if (!ele) return;
      elo += ele.elo;
    }
  );

  // Porównanie progresu (jeśli to potrzebne do innych funkcjonalności)
  const progressObject = compareExerciseProgress(
    findLastExercisesScoresArray,
    req.body.exercises,
    exercisesNames
  );

  const exercisesScoresArray = result.map((ele) => {
    if (ele && ele.exerciseScoreId !== undefined) return ele.exerciseScoreId;
  });
  // Aktualizacja rekordu treningu z wynikami ćwiczeń
  await response.updateOne({ exercises: exercisesScoresArray });
  const currentUserElo = await EloRegistry.findOne({ user: userId })
    .sort({ date: -1 })
    .limit(1);
  if (!currentUserElo) return res.status(404).send({ msg: Message.DidntFind });
  const userRankStatus = await updateUserElo(
    elo,
    currentUserElo.elo,
    user,
    response._id
  );
  return res.status(200).send({
    progress: progressObject,
    gainElo: elo,
    userOldElo: currentUserElo.elo,
    profileRank: userRankStatus.currentRank,
    nextRank: userRankStatus.nextRank,
    msg: Message.Created,
  });
};

const compareExerciseProgress = (
  lastExerciseScores: ExerciseScoresEntity[],
  exerciseScoresTrainingForm: ExerciseScoresTrainingForm[],
  exercisesNames: { exerciseName: string; exerciseId: string }[]
) => {
  // Zmienna wynikowa
  const results = {
    bestProgress: { exercise: "", series: 0, repsScore: 0, weightScore: 0 },
    worseRegress: { exercise: "", series: 0, repsScore: 0, weightScore: 0 },
  };

  // Zmienna śledząca maksymalne różnice dla progresu i regresu
  let maxProgressValue = -Infinity;
  let maxRegressValue = Infinity;

  // Funkcja do liczenia sumarycznego progresu/regresu
  const calculateTotalChange = (repsDiff: number, weightDiff: number) => {
    return repsDiff + weightDiff;
  };


  // Porównywanie wyników
  lastExerciseScores.forEach((lastExerciseScore) => {

    const currentExerciseScores = exerciseScoresTrainingForm.find(
      (exercise) =>
        exercise.exercise === lastExerciseScore.exercise.toString() &&
        exercise.series === lastExerciseScore.series
    );

    if (!currentExerciseScores) return;

    // Porównanie reps
    const repsDiff = currentExerciseScores.reps - lastExerciseScore.reps;

    // Porównanie weight
    const weightDiff = currentExerciseScores.weight - lastExerciseScore.weight;

    // Sprawdzenie najlepszego progresu
    if (repsDiff > 0 || weightDiff > 0) {
      const totalChange = calculateTotalChange(repsDiff, weightDiff);
      if (totalChange > maxProgressValue) {
        maxProgressValue = totalChange;
        results.bestProgress.exercise =
          exercisesNames.find(
            (e) => e.exerciseId === currentExerciseScores.exercise
          )?.exerciseName || "";
        results.bestProgress.series = currentExerciseScores.series;
        results.bestProgress.repsScore = repsDiff;
        results.bestProgress.weightScore = weightDiff;
      }
    }

    // Sprawdzenie najgorszego regresu
    if (repsDiff < 0 || weightDiff < 0) {
      const totalChange = calculateTotalChange(repsDiff, weightDiff);
      if (totalChange < maxRegressValue) {
        maxRegressValue = totalChange;
        results.worseRegress.exercise =
          exercisesNames.find(
            (e) => e.exerciseId === currentExerciseScores.exercise
          )?.exerciseName || "";
        results.worseRegress.series = currentExerciseScores.series;
        results.worseRegress.repsScore = repsDiff;
        results.worseRegress.weightScore = weightDiff;
      }
    }
  });

  // Zwrócenie wyników
  return results;
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

      // Konwersja obiektu na tablicę
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

export { addTraining, getLastTraining, getTrainingByDate, getTrainingDates };
