"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configRouter_1 = __importDefault(require("./configRouter"));
const planDayController_1 = require("../controllers/planDayController");
configRouter_1.default.post("/planDay/:id/createPlanDay", planDayController_1.createPlanDay);
configRouter_1.default.post("/planDay/:id/updatePlanDay", planDayController_1.updatePlanDay);
configRouter_1.default.get("/planDay/:id/getPlanDay", planDayController_1.getPlanDay);
configRouter_1.default.get("/planDay/:id/getPlanDays", planDayController_1.getPlanDays);
configRouter_1.default.get("/planDay/:id/getPlanDaysTypes", planDayController_1.getPlanDaysTypes);
module.exports = configRouter_1.default;
