"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middlewareAuthLocal = exports.middlewareAuth = void 0;
const passport = require('passport');
const jwt = require("jsonwebtoken");
const Message_1 = require("../enums/Message");
const middlewareAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ message: Message_1.Message.InvalidToken });
        }
        if (user.isDeleted) {
            return res.status(401).json({ message: Message_1.Message.Unauthorized });
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
exports.middlewareAuth = middlewareAuth;
const middlewareAuthLocal = (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ msg: Message_1.Message.Unauthorized });
        }
        req.user = user;
        return next();
    })(req, res, next);
};
exports.middlewareAuthLocal = middlewareAuthLocal;
