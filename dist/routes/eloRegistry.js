"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eloRegistryController_1 = require("../controllers/eloRegistryController");
const configRouter_1 = __importDefault(require("./configRouter"));
configRouter_1.default.get("/eloRegistry/:id/getEloRegistryChart", eloRegistryController_1.getEloRegistry);
module.exports = configRouter_1.default;
