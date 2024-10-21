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
exports.updateExercisesScores = exports.addExercisesScores = void 0;
const ExerciseScores_1 = __importDefault(require("../models/ExerciseScores"));
const addExercisesScores = (form) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ExerciseScores_1.default.create(form);
    return { exerciseScoreId: result._id };
});
exports.addExercisesScores = addExercisesScores;
const updateExercisesScores = (form) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ExerciseScores_1.default.findByIdAndUpdate(form._id, form);
    return { exerciseScoreId: result._id };
});
exports.updateExercisesScores = updateExercisesScores;
