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
exports.findExerciseScore = void 0;
const ExerciseScores_1 = __importDefault(require("../models/ExerciseScores"));
const Training_1 = __importDefault(require("../models/Training"));
const findExerciseScore = (gymId, userId, exerciseId, seriesNumber) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trainings = yield Training_1.default.find({
            user: userId,
            gym: gymId,
        }).select("_id");
        const trainingIds = trainings.map((t) => t._id);
        const exerciseScore = yield ExerciseScores_1.default.findOne({
            user: userId,
            exercise: exerciseId,
            series: seriesNumber,
            training: { $in: trainingIds },
        })
            .sort({ createdAt: -1 })
            .exec();
        return exerciseScore || null;
    }
    catch (error) {
        console.error("Error in findExerciseScore:", error);
        return null;
    }
});
exports.findExerciseScore = findExerciseScore;
