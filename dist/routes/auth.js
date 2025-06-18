"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("./../middlewares/auth");
const userController_1 = require("../controllers/userController");
const passport = require("passport");
const configRouter_1 = __importDefault(require("./configRouter"));
const Message_1 = require("../enums/Message");
configRouter_1.default.post("/register", userController_1.register);
configRouter_1.default.post("/login", (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user) => {
        if (err)
            return next(err);
        if (!user) {
            return res.status(401).json({ msg: Message_1.Message.Unauthorized });
        }
        req.user = user;
        return (0, userController_1.login)(req, res);
    })(req, res, next);
});
configRouter_1.default.get("/:id/isAdmin", userController_1.isAdmin);
configRouter_1.default.get("/:id/getUserInfo", userController_1.getUserInfo);
configRouter_1.default.get("/checkToken", auth_1.checkJwtToken, (req, res) => {
    return res.json({ isValid: true, user: req.user });
});
configRouter_1.default.get("/getUsersRanking", userController_1.getUsersRanking);
configRouter_1.default.get("/userInfo/:id/getUserEloPoints", userController_1.getUserElo);
module.exports = configRouter_1.default;
