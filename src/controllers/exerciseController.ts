import Params from "../interfaces/Params";
import ResponseMessage from "../interfaces/ResponseMessage";
import { Request, Response } from "express";
import { ExerciseForm } from "../interfaces/Exercise";
import Exercise from "../models/Exercise";
import { Message } from "../enums/Message";
import { BodyParts } from "../enums/BodyParts";
import User from "../models/User";

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
  req: Request<{}, {}, { id: string }>,
  res: Response<ResponseMessage>
) => {
  if (!req.body.id) return res.status(400).send({ msg: Message.FieldRequired });
  await Exercise.findByIdAndDelete(req.body.id).exec();
  return res.status(200).send({ msg: Message.Deleted });
};

const updateExercise = async (
  req: Request<{}, {}, ExerciseForm>,
  res: Response<ResponseMessage>
) => {
  if (!req.body._id) return res.status(400).send({ msg: Message.FieldRequired });
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
    $or: [
      { user: findUser._id },
      { user: { $exists: false } },
      { user: null },
    ],
  });
  if (exercises.length > 0) return res.status(200).send(exercises);
  else return res.status(404).send({ msg: Message.DidntFind });
};

const getAllUserExercises = async ( req: Request<Params, {}, {}>,
  res: Response<ExerciseForm[] | ResponseMessage>)=> {
  const findUser = await User.findById(req.params.id);
  if (!findUser || !Object.keys(findUser).length)
    return res.status(404).send({ msg: Message.DidntFind });
  const exercises = await Exercise.find({user: findUser._id});
  if (exercises.length > 0) return res.status(200).send(exercises);
  else return res.status(404).send({ msg: Message.DidntFind });
};

const getAllGlobalExercises = async ( req: Request<{}, {}, {}>,
  res: Response<ExerciseForm[] | ResponseMessage>)=> {
  const exercises = await Exercise.find({user: null});
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
    $or: [
      { user: findUser._id },
      { user: { $exists: false } },
      { user: null } 
    ]
  });
  if (exercises.length > 0) return res.status(200).send(exercises);
  else return res.status(404).send({ msg: Message.DidntFind });
};

export {
  addExercise,
  deleteExercise,
  updateExercise,
  getAllExercises,
  getExerciseByBodyPart,
  addUserExercise,
  getAllUserExercises,
  getAllGlobalExercises
};
