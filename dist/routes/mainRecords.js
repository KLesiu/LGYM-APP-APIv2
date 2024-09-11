"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mainRecordsController = require("./../controllers/mainRecordsController");
const configRouter_1 = __importDefault(require("./configRouter"));
configRouter_1.default.post("/mainRecords/:id/addNewRecords", mainRecordsController.addNewRecords);
configRouter_1.default.get("/mainRecords/:id/getMainRecordsHistory", mainRecordsController.getMainRecordsHistory);
configRouter_1.default.get("/mainRecords/:id/getLastMainRecords", mainRecordsController.getLastMainRecords);
configRouter_1.default.post("/mainRecords/:id/deleteMainRecords", mainRecordsController.deleteMainRecords);
configRouter_1.default.post("/mainRecords/:id/updateMainRecords", mainRecordsController.updateMainRecords);
module.exports = configRouter_1.default;
