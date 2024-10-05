"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configModels_1 = __importDefault(require("./configModels"));
const mongoose = require('mongoose');
const ExerciseScoresSchema = new configModels_1.default({
    exercise: { type: configModels_1.default.Types.ObjectId, ref: 'Exercise', required: true },
    user: { type: configModels_1.default.Types.ObjectId, ref: 'User', required: true },
    reps: { type: Number, required: true },
    series: { type: Number, required: true },
    weight: { type: Number, required: true },
    unit: { type: String, required: true },
    training: { type: configModels_1.default.Types.ObjectId, ref: 'Training', required: true }
}, {
    timestamps: true
});
const ExerciseScores = mongoose.model('ExerciseScores', ExerciseScoresSchema);
exports.default = ExerciseScores;
module.exports = ExerciseScores;
