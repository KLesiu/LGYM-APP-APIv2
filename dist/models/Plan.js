"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configModels_1 = __importDefault(require("./configModels"));
const mongoose = require('mongoose');
const PlanSchema = new configModels_1.default({
    user: { type: configModels_1.default.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    planA: { type: Array, required: false },
    planB: { type: Array, required: false },
    planC: { type: Array, required: false },
    planD: { type: Array, required: false },
    planE: { type: Array, required: false },
    planF: { type: Array, required: false },
    planG: { type: Array, required: false },
    trainingDays: { type: Number, required: true }
});
const Plan = mongoose.model('Plan', PlanSchema);
exports.default = Plan;
module.exports = Plan;
