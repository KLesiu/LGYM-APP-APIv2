"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configRouter_1 = __importDefault(require("./configRouter"));
const gymController_1 = require("../controllers/gymController");
configRouter_1.default.post("/gym/:id/addGym", gymController_1.addGym);
configRouter_1.default.delete("/gym/:id/deleteGym", gymController_1.deleteGym);
configRouter_1.default.get("/gym/:id/getGyms", gymController_1.getGyms);
configRouter_1.default.get("/gym/:id/getGym", gymController_1.getGym);
configRouter_1.default.post("/gym/editGym", gymController_1.editGym);
exports.default = configRouter_1.default;
