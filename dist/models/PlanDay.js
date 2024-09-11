"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configModels_1 = __importDefault(require("./configModels"));
const mongoose = require('mongoose');
const PlanDaySchema = new configModels_1.default({
    type: { type: String, required: true },
    plan: { type: configModels_1.default.Types.ObjectId, ref: "Plan", required: true },
    exercises: [
        {
            series: { type: Number, required: true },
            reps: { type: String, required: true },
            exercise: { type: configModels_1.default.Types.ObjectId, ref: "Exercise", required: true }
        }
    ]
});
const PlanDay = mongoose.model('PlanDay', PlanDaySchema);
exports.default = PlanDay;
module.exports = PlanDay;
