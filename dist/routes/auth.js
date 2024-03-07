"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("./../middlewares/auth");
const userController = require("../controllers/userController");
const passport = require('passport');
const configRouter_1 = __importDefault(require("./configRouter"));
configRouter_1.default.post('/register', userController.register);
configRouter_1.default.post('/login', passport.authenticate('local', { session: false }), userController.login);
configRouter_1.default.post('/isAdmin', userController.isAdmin);
configRouter_1.default.get('/userInfo/:id', userController.getUserInfo);
configRouter_1.default.post('/userRecords', userController.setUserRecords);
configRouter_1.default.post('/userInfo/:id/rank', userController.setUserRank);
configRouter_1.default.get('/checkToken', auth_1.checkJwtToken, (req, res) => {
    //@ts-ignore
    return res.json({ isValid: true, user: req.user });
});
module.exports = configRouter_1.default;
