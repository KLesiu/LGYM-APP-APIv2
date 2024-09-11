"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mainRecordsController = require("./../controllers/mainRecordsController");
const configRouter_1 = __importDefault(require("./configRouter"));
configRouter_1.default.post("/mainRecords/:id/addNewRecords", mainRecordsController.addNewRecords);
module.exports = configRouter_1.default;
