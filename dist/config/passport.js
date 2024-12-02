"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const User_1 = __importDefault(require("../models/User"));
const ExtractJWT = require("passport-jwt").ExtractJwt;
const JWTStrategy = require("passport-jwt").Strategy;
require("dotenv").config();
function verifyCallback(payload, done) {
    return User_1.default.findOne({ _id: payload.id })
        .then(user => done(null, user))
        .catch(err => done(err));
}
exports.passportConfig = () => {
    passport.use(User_1.default.createStrategy());
    passport.use(new JWTStrategy({ jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), secretOrKey: process.env.JWT_SECRET }, verifyCallback));
};
exports.verifyCallback = verifyCallback;
