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
exports.getExerciseScoresChartData = exports.updateExercisesScores = exports.addExercisesScores = void 0;
const ExerciseScores_1 = __importDefault(require("../models/ExerciseScores"));
const User_1 = __importDefault(require("../models/User"));
const Message_1 = require("../enums/Message");
const OneRepMaxHelper_1 = __importDefault(require("../helpers/OneRepMaxHelper"));
const addExercisesScores = (form) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ExerciseScores_1.default.create(form);
    return { exerciseScoreId: result._id };
});
exports.addExercisesScores = addExercisesScores;
const updateExercisesScores = (form) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ExerciseScores_1.default.findByIdAndUpdate(form._id, form);
    if (!result)
        return { exerciseScoreId: "" };
    return { exerciseScoreId: result._id };
});
exports.updateExercisesScores = updateExercisesScores;
const getExerciseScoresChartData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(req.params.id);
    if (!user) {
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    }
    const exerciseScores = yield ExerciseScores_1.default.find({
        user: req.params.id,
        exercise: req.body.exerciseId,
    })
        .sort({ createdAt: 1 })
        .populate("training", "createdAt")
        .populate("exercise", "name");
    const bestSeries = {};
    exerciseScores.forEach((score) => {
        const key = `${score.exercise._id}-${score.training._id}`;
        const oneRepMax = (0, OneRepMaxHelper_1.default)(score.reps, score.weight);
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
    const result = Object.entries(bestSeries).map(([key, best]) => ({
        _id: key,
        value: best.oneRepMax,
        date: best.trainingDate,
        exerciseName: best.exerciseName,
        exerciseId: key.split("-")[0],
    }));
    return res.status(200).send(result);
});
exports.getExerciseScoresChartData = getExerciseScoresChartData;
