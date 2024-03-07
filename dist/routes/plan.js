"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const planController = require("../controllers/planController");
const configRouter_1 = __importDefault(require("./configRouter"));
configRouter_1.default.post('/:id/configPlan', planController.setPlanConfig);
configRouter_1.default.get('/:id/configPlan', planController.getPlanConfig);
configRouter_1.default.post('/:id/setPlan', planController.setPlan);
configRouter_1.default.get('/:id/getPlan', planController.getPlan);
configRouter_1.default.delete('/:id/deletePlan', planController.deletePlan);
configRouter_1.default.post('/:id/setSharedPlan', planController.getSharedPlan);
module.exports = configRouter_1.default;
