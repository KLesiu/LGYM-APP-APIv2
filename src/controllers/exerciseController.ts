import Params from "../interfaces/Params";
import ResponseMessage from "../interfaces/ResponseMessage";
import { Request, Response } from "express";
import {
  ExerciseForm,
  ExerciseHistoryDetails,
  ExerciseTrainingHistoryItem,
  LastExerciseScoresWithGym,
  SeriesScore,
} from "../interfaces/Exercise";
import Exercise from "../models/Exercise";
import { Message } from "../enums/Message";
import { BodyParts } from "../enums/BodyParts";
import User from "../models/User";
import { ObjectId } from "mongodb";
import ExerciseScores from "../models/ExerciseScores";
import Training from "../models/Training";
import { LastExerciseScoresQuery } from "../interfaces/ExercisesScores";

const addExercise = async (
  req: Request<{}, {}, ExerciseForm>,
  res: Response<ResponseMessage>
) => {
  const name = req.body.name;
  const bodyPart = req.body.bodyPart;
  const description = req.body.description;
  const image = req.body.image;
  if (!name || !bodyPart)
    return res.status(400).send({ msg: "Name and body part are required!" });
  const exercise = await Exercise.create({
    name: name,
    bodyPart: bodyPart,
    description: description,
    image: image,
  });
  if (exercise) return res.status(200).send({ msg: Message.Created });
  else return res.status(400).send({ msg: Message.TryAgain });
};

const addUserExercise = async (
  req: Request<Params, {}, ExerciseForm>,
  res: Response<ResponseMessage>
) => {
  const name = req.body.name;
  const bodyPart = req.body.bodyPart;
  const description = req.body.description;
  const image = req.body.image;
  if (!name || !bodyPart)
    return res.status(400).send({ msg: "Name and body part are required!" });
  const user = await User.findById(req.params.id);
  if (!user || !Object.keys(user).length)
    return res.status(404).send({ msg: Message.DidntFind });
  const exercise = await Exercise.create({
    name: name,
    bodyPart: bodyPart,
    description: description,
    image: image,
    user: user,
  });
  if (exercise) return res.status(200).send({ msg: Message.Created });
  else return res.status(400).send({ msg: Message.TryAgain });
};

const deleteExercise = async (
  req: Request<Params, {}, { id: string }>,
  res: Response<ResponseMessage>
) => {
  if (!req.body.id) return res.status(400).send({ msg: Message.FieldRequired });
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send({ msg: Message.DidntFind });
  const exercise = await Exercise.findById(req.body.id);
  if (!exercise) return res.status(404).send({ msg: Message.DidntFind });
  if (user.admin) {
    exercise.isDeleted = true;
    await exercise.save();
  } else {
    if (!exercise.user) return res.status(400).send({ msg: Message.Forbidden });
    if (exercise.user.toString() !== user._id.toString())
      return res.status(403).send({ msg: Message.Forbidden });
    exercise.isDeleted = true;
    await exercise.save();
  }
  return res.status(200).send({ msg: Message.Deleted });
};

const updateExercise = async (
  req: Request<{}, {}, ExerciseForm>,
  res: Response<ResponseMessage>
) => {
  if (!req.body._id)
    return res.status(400).send({ msg: Message.FieldRequired });
  await Exercise.findByIdAndUpdate(req.body._id, req.body).exec();
  return res.status(200).send({ msg: Message.Updated });
};

const getAllExercises = async (
  req: Request<Params, {}, {}>,
  res: Response<ExerciseForm[] | ResponseMessage>
) => {
  const findUser = await User.findById(req.params.id);
  if (!findUser || !Object.keys(findUser).length)
    return res.status(404).send({ msg: Message.DidntFind });
  const exercises = await Exercise.find({
    $or: [{ user: findUser._id }, { user: { $exists: false } }, { user: null }],
  });
  if (exercises.length > 0) return res.status(200).send(exercises);
  else return res.status(404).send({ msg: Message.DidntFind });
};

const getAllUserExercises = async (
  req: Request<Params, {}, {}>,
  res: Response<ExerciseForm[] | ResponseMessage>
) => {
  const findUser = await User.findById(req.params.id);
  if (!findUser || !Object.keys(findUser).length)
    return res.status(404).send({ msg: Message.DidntFind });
  const exercises = await Exercise.find({
    user: findUser._id,
    isDeleted: false,
  });
  if (exercises.length > 0) return res.status(200).send(exercises);
  else return res.status(404).send({ msg: Message.DidntFind });
};

const getAllGlobalExercises = async (
  req: Request<{}, {}, {}>,
  res: Response<ExerciseForm[] | ResponseMessage>
) => {
  const exercises = await Exercise.find({ user: null, isDeleted: false });
  if (exercises.length > 0) return res.status(200).send(exercises);
  else return res.status(404).send({ msg: Message.DidntFind });
};

const getExerciseByBodyPart = async (
  req: Request<Params, {}, { bodyPart: BodyParts }>,
  res: Response<ExerciseForm[] | ResponseMessage>
) => {
  const findUser = await User.findById(req.params.id);
  if (!findUser || !Object.keys(findUser).length)
    return res.status(404).send({ msg: Message.DidntFind });
  const bodyPart = req.body.bodyPart;
  const exercises = await Exercise.find({
    bodyPart: bodyPart,
    isDeleted: false,
    $or: [{ user: findUser._id }, { user: { $exists: false } }, { user: null }],
  });
  if (exercises.length > 0) return res.status(200).send(exercises);
  else return res.status(404).send({ msg: Message.DidntFind });
};

const getExercise = async (
  req: Request<Params>,
  res: Response<ExerciseForm | ResponseMessage>
) => {
  const exercise = await Exercise.findById(req.params.id);
  if (!exercise || !Object.keys(exercise).length)
    return res.status(404).send({ msg: Message.DidntFind });
  return res.status(200).send(exercise);
};

const getLastExerciseScores = async (
  req: Request<Params, {}, LastExerciseScoresQuery>,
  res: Response<LastExerciseScoresWithGym | null>
) => {
  const userId = req.params.id;
  const { series, exerciseId, gym, exerciseName } = req.body;
  const seriesScores = await Promise.all(
    Array.from({ length: series }).map(async (_, seriesIndex) => {
      const seriesNumber = seriesIndex + 1;
      let latestScore;
      if (gym)
        latestScore = exerciseId
          ? await findLatestExerciseScore(userId, exerciseId, seriesNumber, gym)
          : 0;
      else
        latestScore = exerciseId
          ? await findLatestExerciseScore(userId, exerciseId, seriesNumber)
          : 0;

      return {
        series: seriesNumber,
        score: latestScore || null,
      };
    })
  );
  const result = {
    exerciseId: `${exerciseId}`,
    exerciseName: `${exerciseName}`,
    seriesScores,
  } as LastExerciseScoresWithGym;
  res.json(result);
};

const getExerciseScoresFromTrainingByExercise = async (
  req: Request<{}, {}, { exerciseId: string }>,
  res: Response<ExerciseTrainingHistoryItem[] | ResponseMessage>
) => {
  type PopulatedScore = {
    _id: ObjectId;
    reps: number;
    series: number;
    weight: number;
    unit: string;
    training: {
      _id: ObjectId;
      createdAt: Date;
      gym: {
        _id: ObjectId;
        name: string;
      };
      type: {
        _id: ObjectId;
        name: string;
      };
    };
  };

  type RawScore = {
    _id: string;
    reps: number;
    weight: number;
    unit: string;
    series: number;
  };
  try {
    const user = req.user?._id;
    const exerciseId = req.body.exerciseId;

    if (!user || !exerciseId) {
      return res.status(400).send({ msg: "Missing user or exerciseId" });
    }

    const exercisePromise = Exercise.findById(exerciseId, "name").lean().exec();

    const scoresPromise = ExerciseScores.find(
      { user: new ObjectId(user), exercise: new ObjectId(exerciseId) },
      "reps weight unit _id training series"
    )
      .sort({ createdAt: -1 })
      .populate<{ training: PopulatedScore["training"] }>({
        path: "training",
        select: "gym createdAt type",
        populate: [
          {
            path: "gym",
            select: "name",
          },
          {
            path: "type",
            select: "name",
          },
        ],
      })
      .lean()
      .exec() as unknown as Promise<PopulatedScore[]>;
    const [exercise, scores] = await Promise.all([
      exercisePromise,
      scoresPromise,
    ]);

    if (!exercise) {
      return res.status(404).send({ msg: "Exercise not found" });
    }

    const tempTrainingsMap = new Map<
      string,
      {
        _id: string;
        date: Date;
        gymName: string;
        rawScores: RawScore[];
        trainingName: string;
        maxSeries: number;
      }
    >();

    for (const score of scores) {
     if (!score.training || !score.training.gym || !score.training.type) {
        continue;
      }

      const trainingId = score.training._id.toString();
      let trainingItem = tempTrainingsMap.get(trainingId);

      if (!trainingItem) {
        trainingItem = {
          _id: trainingId,
          date: score.training.createdAt,
          gymName: score.training.gym.name,
          trainingName: score.training.type.name,
          rawScores: [],
          maxSeries: 0,
        };
        tempTrainingsMap.set(trainingId, trainingItem);
      }

      trainingItem.rawScores.push({
        _id: score._id.toString(),
        reps: score.reps,
        weight: score.weight,
        unit: score.unit,
        series: score.series,
      });

      trainingItem.maxSeries = Math.max(trainingItem.maxSeries, score.series);
    }

    const finalTrainings: ExerciseTrainingHistoryItem[] = [];

    for (const tempTraining of tempTrainingsMap.values()) {
      const { rawScores, maxSeries } = tempTraining;
      const processedSeriesScores: SeriesScore[] = [];

      if (rawScores.length > 0) {
        const scoreMap = new Map<number, RawScore>();
        for (const rs of rawScores) {
          scoreMap.set(rs.series, rs);
        }

        for (let i = 1; i <= maxSeries; i++) {
          const matchingScore = scoreMap.get(i);
          if (matchingScore) {
            processedSeriesScores.push({
              series: i,
              score: {
                _id: matchingScore._id,
                reps: matchingScore.reps,
                weight: matchingScore.weight,
                unit: matchingScore.unit,
              },
            });
          } else {
            processedSeriesScores.push({
              series: i,
              score: null,
            });
          }
        }
      }

      finalTrainings.push({
        _id: tempTraining._id,
        date: tempTraining.date,
        gymName: tempTraining.gymName,
        trainingName: tempTraining.trainingName,
        seriesScores: processedSeriesScores,
      });
    }

    return res.status(200).send(finalTrainings);
  } catch (error) {
    console.error("Error fetching exercise history:", error);
    return res.status(500).send({ msg: "Internal server error" });
  }
};

const findLatestExerciseScore = async (
  userId: string,
  exerciseId: string,
  seriesNumber: number,
  gym?: string
) => {
  const match: any = {
    user: new ObjectId(userId),
    exercise: new ObjectId(exerciseId),
    series: seriesNumber,
  };

  if (gym) {
    const trainings = await Training.find({ gym }).select("_id");
    match.training = { $in: trainings.map((t) => t._id) };
  }

  const result = await ExerciseScores.findOne(
    match,
    "reps weight unit _id training"
  )
    .sort({ createdAt: -1 })
    .populate({
      path: "training",
      select: "gym",
      populate: {
        path: "gym",
        select: "name",
      },
    })
    .exec();

  if (!result) return null;

  const gymName = (result.training as any)?.gym?.name ?? null;

  return {
    reps: result.reps,
    weight: result.weight,
    unit: result.unit,
    _id: result._id,
    gymName,
  };
};

export {
  addExercise,
  deleteExercise,
  updateExercise,
  getAllExercises,
  getExerciseByBodyPart,
  addUserExercise,
  getAllUserExercises,
  getAllGlobalExercises,
  getExercise,
  getLastExerciseScores,
  getExerciseScoresFromTrainingByExercise,
};
