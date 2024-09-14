"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configRouter_1 = __importDefault(require("./configRouter"));
const exerciseController_1 = require("../controllers/exerciseController");
configRouter_1.default.post("/exercise/addExercise", exerciseController_1.addExercise);
configRouter_1.default.post("/exercise/:id/addUserExercise", exerciseController_1.addUserExercise);
configRouter_1.default.delete("/exercise/deleteExercise", exerciseController_1.deleteExercise);
configRouter_1.default.post("/exercise/updateExercise", exerciseController_1.updateExercise);
configRouter_1.default.get("/exercise/:id/getAllExercises", exerciseController_1.getAllExercises);
configRouter_1.default.get("/exercise/:id/getExerciseByBodyPart", exerciseController_1.getExerciseByBodyPart);
configRouter_1.default.get("/exercise/getAllGlobalExercises", exerciseController_1.getAllGlobalExercises);
configRouter_1.default.get("/exercise/:id/getAllUserExercises", exerciseController_1.getAllUserExercises);
module.exports = configRouter_1.default;
