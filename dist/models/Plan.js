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
    trainingDays: { type: Number, required: true }
});
const Plan = mongoose.model('Plan', PlanSchema);
exports.default = Plan;
module.exports = Plan;
