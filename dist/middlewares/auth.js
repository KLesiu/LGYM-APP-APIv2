"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkJwtToken = void 0;
//@ts-nocheck
const passport = require('passport');
const jwt = require("jsonwebtoken");
const Message_1 = require("../enums/Message");
exports.middlewareAuth = (req, res, next) => passport.authenticate("jwt", { session: false })(req, res, next);
const checkJwtToken = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ message: Message_1.Message.InvalidToken });
        }
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET, (verifyErr) => {
            if (verifyErr) {
                return res.status(401).json({ message: Message_1.Message.ExpiredToken });
            }
            req.user = user;
            next();
        });
    })(req, res, next);
};
exports.checkJwtToken = checkJwtToken;
