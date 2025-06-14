"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appVersionController_1 = require("../controllers/appVersionController");
const configRouter_1 = __importDefault(require("./configRouter"));
configRouter_1.default.post("/appConfig/getAppVersion", appVersionController_1.getAppVersion);
configRouter_1.default.post("/appConfig/createNewAppVersion/:id", appVersionController_1.createNewAppVersion);
module.exports = configRouter_1.default;
