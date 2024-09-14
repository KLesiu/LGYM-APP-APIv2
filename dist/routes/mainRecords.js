"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mainRecordsController_1 = require("../controllers/mainRecordsController");
const configRouter_1 = __importDefault(require("./configRouter"));
configRouter_1.default.post("/mainRecords/:id/addNewRecords", mainRecordsController_1.addNewRecords);
configRouter_1.default.get("/mainRecords/:id/getMainRecordsHistory", mainRecordsController_1.getMainRecordsHistory);
configRouter_1.default.get("/mainRecords/:id/getLastMainRecords", mainRecordsController_1.getLastMainRecords);
configRouter_1.default.post("/mainRecords/:id/deleteMainRecords", mainRecordsController_1.deleteMainRecords);
configRouter_1.default.post("/mainRecords/:id/updateMainRecords", mainRecordsController_1.updateMainRecords);
module.exports = configRouter_1.default;
