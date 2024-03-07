"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.register = [
    body("name").trim().isLength({ min: 1 }).withMessage("Name is required, and has to have minimum one character"),
    body('email').isEmail().withMessage('This email is not valid!'),
    body('password').isLength({ min: 6 }).withMessage('Passwword need to have minimum six characters'),
    body('cpassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords need to be same'),
    asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(404).send({
                errors: errors.array()
            });
        }
        const name = req.body.name;
        const admin = false;
        const email = req.body.email;
        const password = req.body.password;
        const checkName = yield User_1.default.findOne({ name: name }).exec();
        if (checkName) {
            if (checkName.name === name) {
                return res.status(404).send({ errors: [
                        {
                            msg: 'We have user with that name'
                        }
                    ] });
            }
        }
        const checkEmail = yield User_1.default.findOne({ email: email }).exec();
        if (checkEmail) {
            if (checkEmail.email === email) {
                return res.status(404).send({ errors: [
                        {
                            msg: 'We have user with that email'
                        }
                    ] });
            }
        }
        const user = new User_1.default({ name: name, admin: admin, email: email, rank: 'Junior', profileRank: 'Junior I', elo: 1000 });
        yield User_1.default.register(user, password);
        res.status(200).send({ msg: "User created successfully!" });
    }))
];
exports.login = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).send({ token: token, req: req.user });
    });
};
exports.isAdmin = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const admin = yield User_1.default.findById(req.body._id);
        return res.status(200).send(admin);
    });
};
exports.getUserInfo = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const UserInfo = yield User_1.default.findById(id);
        if (UserInfo)
            return res.status(200).send(UserInfo);
        return res.status(404).send("Didnt find");
    });
};
exports.setUserRecords = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.body.id;
        yield User_1.default.findByIdAndUpdate(id, { Sq: req.body.sq });
        yield User_1.default.findByIdAndUpdate(id, { Dl: req.body.dl });
        yield User_1.default.findByIdAndUpdate(id, { Bp: req.body.bp });
        return res.status(200).send({ msg: 'Updated' });
    });
};
exports.setUserRank = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const rank = req.body.rank;
        yield User_1.default.findByIdAndUpdate(id, { rank: rank });
        return res.status(200).send({ msg: 'Updated' });
    });
};
