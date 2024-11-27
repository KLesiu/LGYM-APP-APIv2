"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configModels_1 = __importDefault(require("./configModels"));
const mongoose_1 = __importDefault(require("mongoose"));
const TrainingSchema = new configModels_1.default({
    // Użytkownik, który dodał trening
    user: { type: configModels_1.default.Types.ObjectId, ref: "User", required: true },
    // Plan Dnia, do którego przypisany jest trening
    type: { type: configModels_1.default.Types.ObjectId, ref: 'PlanDay', required: true },
    // Wykonane ćwiczenia Typ:{exerciseScoreId: string}[], gdzie exerciseScoreId to id modelu ExerciseScore
    exercises: { type: Array, required: false },
    // Data utworzenia
    createdAt: { type: Date, required: true },
    // Siownia na której wykonano trening
    gym: { type: configModels_1.default.Types.ObjectId, ref: 'Gym', required: true }
});
const Training = mongoose_1.default.model('Training', TrainingSchema);
exports.default = Training;
