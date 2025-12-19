"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mainRecordsController_1 = require("../controllers/mainRecordsController");
const configRouter_1 = __importDefault(require("./configRouter"));
configRouter_1.default.post("/mainRecords/:id/addNewRecord", mainRecordsController_1.addNewRecords);
configRouter_1.default.get("/mainRecords/:id/getMainRecordsHistory", mainRecordsController_1.getMainRecordsHistory);
configRouter_1.default.get("/mainRecords/:id/getLastMainRecords", mainRecordsController_1.getLastMainRecords);
configRouter_1.default.get("/mainRecords/:id/deleteMainRecord", mainRecordsController_1.deleteMainRecords);
configRouter_1.default.post("/mainRecords/:id/updateMainRecords", mainRecordsController_1.updateMainRecords);
configRouter_1.default.post("/mainRecords/getRecordOrPossibleRecordInExercise", mainRecordsController_1.getRecordOrPossibleRecordInExercise);
exports.default = configRouter_1.default;
