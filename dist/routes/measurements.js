"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const measurementsController_1 = require("../controllers/measurementsController");
const configRouter_1 = __importDefault(require("./configRouter"));
configRouter_1.default.post("/measurements/add", measurementsController_1.addMeasurement);
configRouter_1.default.get("/measurements:/:id/getMeasurementDetail", measurementsController_1.getMeasurementDetails);
configRouter_1.default.get("/measurements/:id/getHistory", measurementsController_1.getMeasurementsHistory);
exports.default = configRouter_1.default;
