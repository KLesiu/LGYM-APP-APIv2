"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configModels_1 = __importDefault(require("./configModels"));
const mongoose = require('mongoose');
const ExerciseSchema = new configModels_1.default({
    name: { type: String, maxLength: 40, required: true },
    reps: { type: String, required: false },
    repCurrent: { type: Number, required: false },
    weight: { type: Number, required: false },
    series: { type: Number, required: false }
});
const Exercise = mongoose.model('Exercise', ExerciseSchema);
exports.default = Exercise;
module.exports = Exercise;
