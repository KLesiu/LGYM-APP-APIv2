"use strict";
//@ts-nocheck
const passport = require("passport");
const User = require("../models/User");
const ExtractJWT = require("passport-jwt").ExtractJwt;
const JWTStrategy = require("passport-jwt").Strategy;
require("dotenv").config();
function verifyCallback(payload, done) {
    return User.findOne({ _id: payload.id })
        .then(user => done(null, user))
        .catch(err => done(err));
}
exports.passportConfig = () => {
    passport.use(User.createStrategy());
    passport.use(new JWTStrategy({ jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), secretOrKey: process.env.JWT_SECRET }, verifyCallback));
};
exports.verifyCallback = verifyCallback;
