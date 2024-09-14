"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const measurementsController_1 = require("../controllers/measurementsController");
const configRouter_1 = __importDefault(require("./configRouter"));
configRouter_1.default.post("/measurements/:id/addNew", measurementsController_1.addMeasurements);
configRouter_1.default.get("/measurements:/:id/getHistory", measurementsController_1.getMeasurementsHistory);
configRouter_1.default.get("/measurements/:id/getLast", measurementsController_1.getLastMeasurements);
module.exports = configRouter_1.default;
