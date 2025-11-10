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
exports.getExerciseScoresFromTrainingByExercise = exports.getLastExerciseScores = exports.getExercise = exports.getAllGlobalExercises = exports.getAllUserExercises = exports.addUserExercise = exports.getExerciseByBodyPart = exports.getAllExercises = exports.updateExercise = exports.deleteExercise = exports.addExercise = void 0;
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
    const user = yield User_1.default.findById(req.params.id);
    if (!user)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const exercise = yield Exercise_1.default.findById(req.body.id);
    if (!exercise)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    if (user.admin) {
        exercise.isDeleted = true;
        yield exercise.save();
    }
    else {
        if (!exercise.user)
            return res.status(400).send({ msg: Message_1.Message.Forbidden });
        if (exercise.user.toString() !== user._id.toString())
            return res.status(403).send({ msg: Message_1.Message.Forbidden });
        exercise.isDeleted = true;
        yield exercise.save();
    }
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
        $or: [{ user: findUser._id }, { user: { $exists: false } }, { user: null }],
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
    const exercises = yield Exercise_1.default.find({
        user: findUser._id,
        isDeleted: false,
    });
    if (exercises.length > 0)
        return res.status(200).send(exercises);
    else
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
});
exports.getAllUserExercises = getAllUserExercises;
const getAllGlobalExercises = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const exercises = yield Exercise_1.default.find({ user: null, isDeleted: false });
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
        isDeleted: false,
        $or: [{ user: findUser._id }, { user: { $exists: false } }, { user: null }],
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
    const { series, exerciseId, gym, exerciseName } = req.body;
    const seriesScores = yield Promise.all(Array.from({ length: series }).map((_, seriesIndex) => __awaiter(void 0, void 0, void 0, function* () {
        const seriesNumber = seriesIndex + 1;
        let latestScore;
        if (gym)
            latestScore = exerciseId
                ? yield findLatestExerciseScore(userId, exerciseId, seriesNumber, gym)
                : 0;
        else
            latestScore = exerciseId
                ? yield findLatestExerciseScore(userId, exerciseId, seriesNumber)
                : 0;
        return {
            series: seriesNumber,
            score: latestScore || null,
        };
    })));
    const result = {
        exerciseId: `${exerciseId}`,
        exerciseName: `${exerciseName}`,
        seriesScores,
    };
    res.json(result);
});
exports.getLastExerciseScores = getLastExerciseScores;
const getExerciseScoresFromTrainingByExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const exerciseId = req.body.exerciseId;
        if (!user || !exerciseId) {
            return res.status(400).send({ msg: "Missing user or exerciseId" });
        }
        const exercisePromise = Exercise_1.default.findById(exerciseId, "name").lean().exec();
        const scoresPromise = ExerciseScores_1.default.find({ user: new mongodb_1.ObjectId(user), exercise: new mongodb_1.ObjectId(exerciseId) }, "reps weight unit _id training series")
            .sort({ createdAt: -1 })
            .populate({
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
            .exec();
        const [exercise, scores] = yield Promise.all([
            exercisePromise,
            scoresPromise,
        ]);
        if (!exercise) {
            return res.status(404).send({ msg: "Exercise not found" });
        }
        const tempTrainingsMap = new Map();
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
        const finalTrainings = [];
        for (const tempTraining of tempTrainingsMap.values()) {
            const { rawScores, maxSeries } = tempTraining;
            const processedSeriesScores = [];
            if (rawScores.length > 0) {
                const scoreMap = new Map();
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
                    }
                    else {
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
    }
    catch (error) {
        console.error("Error fetching exercise history:", error);
        return res.status(500).send({ msg: "Internal server error" });
    }
});
exports.getExerciseScoresFromTrainingByExercise = getExerciseScoresFromTrainingByExercise;
const findLatestExerciseScore = (userId, exerciseId, seriesNumber, gym) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
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
            select: "name",
        },
    })
        .exec();
    if (!result)
        return null;
    const gymName = (_d = (_c = (_b = result.training) === null || _b === void 0 ? void 0 : _b.gym) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : null;
    return {
        reps: result.reps,
        weight: result.weight,
        unit: result.unit,
        _id: result._id,
        gymName,
    };
});
