"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exercisesScoresController_1 = require("../controllers/exercisesScoresController");
const configRouter_1 = __importDefault(require("./configRouter"));
configRouter_1.default.post("/exerciseScores/:id/getExerciseScoresChartData", exercisesScoresController_1.getExerciseScoresChartData);
exports.default = configRouter_1.default;
