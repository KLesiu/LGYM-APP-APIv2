"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configModels_1 = __importDefault(require("./configModels"));
const mongoose = require('mongoose');
const ExerciseSchema = new configModels_1.default({
    //Nazwa ćwiczenia
    name: { type: String, required: true },
    // Partia, na którą najbardziej działa ćwiczenie 
    bodyPart: { type: String, required: true },
    // Opis ćwiczenia
    description: { type: String, required: false },
    // Zdjęcie ćwiczenia
    image: { type: String, required: false },
    // Użytkownik, który dodał ćwiczenie. jeśli brak pola user to oznacza, że jest to ćwiczenie globalne widoczne dla wszystkich użytkowników jeśli nie to jest to ćwiczenie prywatne dla użytkownika, który je dodał
    user: { type: configModels_1.default.Types.ObjectId, ref: 'User', required: false }
});
const Exercise = mongoose.model('Exercise', ExerciseSchema);
exports.default = Exercise;
module.exports = Exercise;
