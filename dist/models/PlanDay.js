"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configModels_1 = __importDefault(require("./configModels"));
const mongoose = require('mongoose');
const PlanDaySchema = new configModels_1.default({
    // Nazwa planu dnia
    name: { type: String, required: true },
    // Plan, do którego przypisany jest dzień treningowy
    plan: { type: configModels_1.default.Types.ObjectId, ref: "Plan", required: true },
    // Czy plan dnia jest usunięty
    isDeleted: { type: Boolean, required: true },
    // Ćwiczenia w planie dnia
    exercises: [
        {
            // Ilość serii
            series: { type: Number, required: true },
            // Ilość powtórzeń
            reps: { type: String, required: true },
            // Ćwiczenie
            exercise: { type: configModels_1.default.Types.ObjectId, ref: "Exercise", required: true }
        }
    ]
});
const PlanDay = mongoose.model('PlanDay', PlanDaySchema);
exports.default = PlanDay;
module.exports = PlanDay;
