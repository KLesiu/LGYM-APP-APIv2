"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const planController_1 = require("../controllers/planController");
const configRouter_1 = __importDefault(require("./configRouter"));
configRouter_1.default.post('/:id/createPlan', planController_1.createPlan);
configRouter_1.default.post('/:id/updatePlan', planController_1.updatePlan);
configRouter_1.default.get('/:id/getPlanConfig', planController_1.getPlanConfig);
configRouter_1.default.get("/:id/checkIsUserHavePlan", planController_1.checkIsUserHavePlan);
configRouter_1.default.get("/:id/getPlansList", planController_1.getPlansList);
configRouter_1.default.post("/:id/setNewActivePlan", planController_1.setNewActivePlan);
exports.default = configRouter_1.default;
