"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configRouter_1 = __importDefault(require("./configRouter"));
const trainingController_1 = require("../controllers/trainingController");
configRouter_1.default.post('/:id/addTraining', trainingController_1.addTraining);
configRouter_1.default.get('/:id/getLastTraining', trainingController_1.getLastTraining);
module.exports = configRouter_1.default;
