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
exports.getBpDlSqChartData = exports.updateExercisesScores = exports.addExercisesScores = void 0;
const ExerciseScores_1 = __importDefault(require("../models/ExerciseScores"));
const User_1 = __importDefault(require("../models/User"));
const Message_1 = require("../enums/Message");
const Exercise_1 = __importDefault(require("../models/Exercise"));
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
const getBpDlSqChartData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allowedExercises = ["Squat", "Deadlift", "Bench Press"];
    const user = yield User_1.default.findById(req.params.id);
    if (!user) {
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    }
    const exercises = yield Exercise_1.default.find({ name: { $in: allowedExercises }, user: undefined });
    if (exercises.length === 0) {
        return res.status(404).send({ msg: "No exercises found" });
    }
    const exerciseIds = exercises.map(exercise => exercise._id);
    const exerciseScores = yield ExerciseScores_1.default.find({
        user: req.params.id,
        exercise: { $in: exerciseIds },
    })
        .sort({ createdAt: 1 })
        .populate("training", "createdAt")
        .populate("exercise", "name");
    const result = exerciseScores.map((score) => ({
        _id: score._id,
        value: score.weight,
        date: score.training.createdAt,
        exerciseName: score.exercise.name,
        exerciseId: score.exercise._id,
    }));
    return res.status(200).send(result);
});
exports.getBpDlSqChartData = getBpDlSqChartData;
