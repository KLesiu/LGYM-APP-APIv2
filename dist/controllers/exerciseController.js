"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastExerciseScores = exports.getExercise = exports.getAllGlobalExercises = exports.getAllUserExercises = exports.addUserExercise = exports.getExerciseByBodyPart = exports.getAllExercises = exports.updateExercise = exports.deleteExercise = exports.addExercise = void 0;
const Exercise_1 = __importDefault(require("../models/Exercise"));
const Message_1 = require("../enums/Message");
const User_1 = __importDefault(require("../models/User"));
const mongodb_1 = require("mongodb");
const ExerciseScores_1 = __importDefault(require("../models/ExerciseScores"));
const Training_1 = __importDefault(require("../models/Training"));
const addExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const bodyPart = req.body.bodyPart;
    const description = req.body.description;
    const image = req.body.image;
    if (!name || !bodyPart)
        return res.status(400).send({ msg: "Name and body part are required!" });
    const exercise = yield Exercise_1.default.create({
        name: name,
        bodyPart: bodyPart,
        description: description,
        image: image,
    });
    if (exercise)
        return res.status(200).send({ msg: Message_1.Message.Created });
    else
        return res.status(400).send({ msg: Message_1.Message.TryAgain });
});
exports.addExercise = addExercise;
const addUserExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const bodyPart = req.body.bodyPart;
    const description = req.body.description;
    const image = req.body.image;
    if (!name || !bodyPart)
        return res.status(400).send({ msg: "Name and body part are required!" });
    const user = yield User_1.default.findById(req.params.id);
    if (!user || !Object.keys(user).length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const exercise = yield Exercise_1.default.create({
        name: name,
        bodyPart: bodyPart,
        description: description,
        image: image,
        user: user,
    });
    if (exercise)
        return res.status(200).send({ msg: Message_1.Message.Created });
    else
        return res.status(400).send({ msg: Message_1.Message.TryAgain });
});
exports.addUserExercise = addUserExercise;
const deleteExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.id)
        return res.status(400).send({ msg: Message_1.Message.FieldRequired });
    yield Exercise_1.default.findByIdAndDelete(req.body.id).exec();
    return res.status(200).send({ msg: Message_1.Message.Deleted });
});
exports.deleteExercise = deleteExercise;
const updateExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body._id)
        return res.status(400).send({ msg: Message_1.Message.FieldRequired });
    yield Exercise_1.default.findByIdAndUpdate(req.body._id, req.body).exec();
    return res.status(200).send({ msg: Message_1.Message.Updated });
});
exports.updateExercise = updateExercise;
const getAllExercises = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const findUser = yield User_1.default.findById(req.params.id);
    if (!findUser || !Object.keys(findUser).length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const exercises = yield Exercise_1.default.find({
        $or: [
            { user: findUser._id },
            { user: { $exists: false } },
            { user: null },
        ],
    });
    if (exercises.length > 0)
        return res.status(200).send(exercises);
    else
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
});
exports.getAllExercises = getAllExercises;
const getAllUserExercises = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const findUser = yield User_1.default.findById(req.params.id);
    if (!findUser || !Object.keys(findUser).length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const exercises = yield Exercise_1.default.find({ user: findUser._id });
    if (exercises.length > 0)
        return res.status(200).send(exercises);
    else
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
});
exports.getAllUserExercises = getAllUserExercises;
const getAllGlobalExercises = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const exercises = yield Exercise_1.default.find({ user: null });
    if (exercises.length > 0)
        return res.status(200).send(exercises);
    else
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
});
exports.getAllGlobalExercises = getAllGlobalExercises;
const getExerciseByBodyPart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const findUser = yield User_1.default.findById(req.params.id);
    if (!findUser || !Object.keys(findUser).length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const bodyPart = req.body.bodyPart;
    const exercises = yield Exercise_1.default.find({
        bodyPart: bodyPart,
        $or: [
            { user: findUser._id },
            { user: { $exists: false } },
            { user: null }
        ]
    });
    if (exercises.length > 0)
        return res.status(200).send(exercises);
    else
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
});
exports.getExerciseByBodyPart = getExerciseByBodyPart;
const getExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const exercise = yield Exercise_1.default.findById(req.params.id);
    if (!exercise || !Object.keys(exercise).length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    return res.status(200).send(exercise);
});
exports.getExercise = getExercise;
const getLastExerciseScores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const { series, exerciseId, gym } = req.body;
    const seriesScores = yield Promise.all(Array.from({ length: series }).map((_, seriesIndex) => __awaiter(void 0, void 0, void 0, function* () {
        const seriesNumber = seriesIndex + 1;
        let latestScore;
        if (gym)
            latestScore = exerciseId ? yield findLatestExerciseScore(userId, exerciseId, seriesNumber, gym) : 0;
        else
            latestScore = exerciseId ? yield findLatestExerciseScore(userId, exerciseId, seriesNumber) : 0;
        return {
            series: seriesNumber,
            score: latestScore || null,
        };
    })));
    const result = {
        exerciseId: `${exerciseId}`,
        seriesScores,
    };
    res.json(result);
});
exports.getLastExerciseScores = getLastExerciseScores;
const findLatestExerciseScore = (userId, exerciseId, seriesNumber, gym) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const match = {
        user: new mongodb_1.ObjectId(userId),
        exercise: new mongodb_1.ObjectId(exerciseId),
        series: seriesNumber,
    };
    if (gym) {
        const trainings = yield Training_1.default.find({ gym }).select("_id");
        match.training = { $in: trainings.map((t) => t._id) };
    }
    const result = yield ExerciseScores_1.default.findOne(match, "reps weight unit _id training")
        .sort({ createdAt: -1 })
        .populate({
        path: "training",
        select: "gym",
        populate: {
            path: "gym",
            select: "name"
        }
    })
        .exec();
    if (!result)
        return null;
    const gymName = (_c = (_b = (_a = result.training) === null || _a === void 0 ? void 0 : _a.gym) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : null;
    return {
        reps: result.reps,
        weight: result.weight,
        unit: result.unit,
        _id: result._id,
        gymName,
    };
});
