"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configModels_1 = __importDefault(require("./configModels"));
const mongoose = require('mongoose');
const TrainingSchema = new configModels_1.default({
    user: { type: configModels_1.default.Types.ObjectId, ref: "User", required: true },
    type: { type: String, maxLength: 1, required: true },
    exercises: { type: Array, required: false },
    createdAt: { type: String, required: true },
    plan: { type: configModels_1.default.Types.ObjectId, ref: 'Plan', required: false }
});
const Training = mongoose.model('Training', TrainingSchema);
exports.default = Training;
module.exports = Training;
