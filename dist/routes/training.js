"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const trainingController = require('../controllers/trainingController');
const configRouter_1 = __importDefault(require("./configRouter"));
configRouter_1.default.post('/:id/addTraining', trainingController.addTraining);
configRouter_1.default.get('/:id/getTrainingHistory', trainingController.getTrainingHistory);
configRouter_1.default.get('/:id/getTrainingSession', trainingController.getCurrentTrainingSession);
configRouter_1.default.get('/:id/getPrevSessionTraining/:day', trainingController.getPreviousTrainingSession);
configRouter_1.default.get(`/:id/checkPrevSessionTraining/:day`, trainingController.checkPreviousTrainingSession);
configRouter_1.default.post('/:id/getTraining', trainingController.getTraining);
module.exports = configRouter_1.default;
