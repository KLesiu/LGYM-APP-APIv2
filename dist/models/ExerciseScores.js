"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configModels_1 = __importDefault(require("./configModels"));
const mongoose_1 = __importDefault(require("mongoose"));
const ExerciseScoresSchema = new configModels_1.default({
    // Ćwiczenie, dla którego zapisujemy wynik
    exercise: { type: configModels_1.default.Types.ObjectId, ref: 'Exercise', required: true },
    // Użytkownik, który zapisuje wynik
    user: { type: configModels_1.default.Types.ObjectId, ref: 'User', required: true },
    // Powtórzenia wykonane w danej serii
    reps: { type: Number, required: true },
    // Numer serii
    series: { type: Number, required: true },
    // Ciężar, z jakim wykonano serie
    weight: { type: Number, required: true },
    // Jednostka wagi
    unit: { type: String, required: true },
    // Trening, w którym wykonano ćwiczenie
    training: { type: configModels_1.default.Types.ObjectId, ref: 'Training', required: true }
}, {
    timestamps: true
});
const ExerciseScores = mongoose_1.default.model('ExerciseScores', ExerciseScoresSchema);
exports.default = ExerciseScores;
