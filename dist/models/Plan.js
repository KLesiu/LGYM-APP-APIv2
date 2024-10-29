"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configModels_1 = __importDefault(require("./configModels"));
const mongoose = require('mongoose');
const PlanSchema = new configModels_1.default({
    // Użytkownik, który stworzył plan
    user: { type: configModels_1.default.Types.ObjectId, ref: "User", required: true },
    // Nazwa planu
    name: { type: String, required: true },
    // Ilość dni treningowych w planie TODO:(do kasacji)
    trainingDays: { type: Number, required: true }
});
const Plan = mongoose.model('Plan', PlanSchema);
exports.default = Plan;
module.exports = Plan;
