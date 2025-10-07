"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../controllers/userController");
const configRouter_1 = __importDefault(require("./configRouter"));
const auth_1 = require("../middlewares/auth");
configRouter_1.default.post("/register", userController_1.register);
configRouter_1.default.post("/login", auth_1.middlewareAuthLocal, userController_1.login);
configRouter_1.default.get("/:id/isAdmin", userController_1.isAdmin);
configRouter_1.default.get("/checkToken", auth_1.middlewareAuth, userController_1.getUserInfo);
configRouter_1.default.get("/getUsersRanking", userController_1.getUsersRanking);
configRouter_1.default.get("/userInfo/:id/getUserEloPoints", userController_1.getUserElo);
configRouter_1.default.get("/deleteAccount", auth_1.middlewareAuth, userController_1.deleteAccount);
module.exports = configRouter_1.default;
