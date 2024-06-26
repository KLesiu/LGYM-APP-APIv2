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
exports.ranks = void 0;
const User_1 = __importDefault(require("../models/User"));
const Message_1 = require("../enums/Message");
const Training_1 = __importDefault(require("../models/Training"));
const Measurements_1 = __importDefault(require("../models/Measurements"));
const Plan_1 = __importDefault(require("../models/Plan"));
const passport = require('passport');
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.ranks = [
    { name: 'Junior 1', maxElo: 1000 }, // 0-1000
    { name: 'Junior 2', maxElo: 2500 }, //1000 - 2500
    { name: 'Junior 3', maxElo: 4000 }, //2500 - 4000
    { name: 'Mid 1', maxElo: 5000 }, //4000 - 5000
    { name: 'Mid 2', maxElo: 6000 }, // 5000 - 6000
    { name: 'Mid 3', maxElo: 7000 }, // 6000 - 7000
    { name: 'Pro 1', maxElo: 10000 }, // 7000 - 10000
    { name: 'Pro 2', maxElo: 13000 }, // 10 000 - 13 000
    { name: 'Pro 3', maxElo: 17000 }, // 13 000 - 17 000
    { name: 'Champ', maxElo: 20000 } // 17 000 - to the sky
];
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
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        const userInfo = {
            name: req.user.name,
            _id: req.user._id,
            email: req.user.email,
            Bp: req.user.Bp,
            Dl: req.user.Dl,
            Sq: req.user.Sq
        };
        return res.status(200).send({ token: token, req: userInfo });
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
        return res.status(200).send({ msg: Message_1.Message.Updated });
    });
};
exports.setUserRank = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const rank = req.body.rank;
        yield User_1.default.findByIdAndUpdate(id, { rank: rank });
        return res.status(200).send({ msg: Message_1.Message.Updated });
    });
};
exports.updateUserRank = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const user = yield User_1.default.findById(id);
        const userElo = user.elo;
        let userRank = '';
        for (let i = 0; i < exports.ranks.length; i++) {
            if (userElo <= exports.ranks[i].maxElo) {
                userRank = exports.ranks[i].name;
                break;
            }
        }
        yield User_1.default.findByIdAndUpdate(id, { profileRank: userRank });
        return res.send({ msg: userRank, isNew: user.profileRank === userRank ? false : true });
    });
};
exports.getUserElo = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const result = yield User_1.default.findById(id);
        if (!result)
            return res.status(404).send({ msg: Message_1.Message.DidntFind });
        return res.status(200).send({
            elo: result.elo
        });
    });
};
exports.deleteAccount = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentUser = req.user;
        if (currentUser.email !== req.body.email)
            return res.status(401).send({ msg: 'Wrong email!' });
        const trainings = yield Training_1.default.find({ user: currentUser._id });
        const measurements = yield Measurements_1.default.find({ user: currentUser._id });
        const plans = yield Plan_1.default.find({ user: currentUser._id });
        const trainingDeletions = trainings.map((training) => Training_1.default.findByIdAndDelete(training._id).exec());
        const measurementDeletions = measurements.map((measurement) => Measurements_1.default.findByIdAndDelete(measurement._id).exec());
        const planDeletions = plans.map((plan) => Plan_1.default.findByIdAndDelete(plan._id).exec());
        yield Promise.all([...trainingDeletions, ...measurementDeletions, ...planDeletions]);
        yield User_1.default.findByIdAndDelete(currentUser._id);
        return res.send({ msg: Message_1.Message.Deleted });
    });
};
