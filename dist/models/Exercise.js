"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configModels_1 = __importDefault(require("./configModels"));
const mongoose = require('mongoose');
const ExerciseSchema = new configModels_1.default({
    name: { type: String, required: true },
    bodyPart: { type: String, required: true },
    description: { type: String, required: false },
    image: { type: String, required: false },
    user: { type: configModels_1.default.Types.ObjectId, ref: 'User', required: false }
});
const Exercise = mongoose.model('Exercise', ExerciseSchema);
exports.default = Exercise;
module.exports = Exercise;
