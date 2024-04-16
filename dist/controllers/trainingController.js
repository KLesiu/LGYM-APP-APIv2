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
require("dotenv").config();
const Training_1 = __importDefault(require("../models/Training"));
const Plan_1 = __importDefault(require("../models/Plan"));
const User_1 = __importDefault(require("../models/User"));
exports.addTraining = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const findUser = yield User_1.default.findById(id);
    const day = req.body.day;
    const exercises = req.body.training;
    const createdAt = req.body.createdAt;
    const plan = yield Plan_1.default.findOne({ user: findUser });
    const date = new Date(createdAt).toString();
    const prevSessions = yield Training_1.default.find({ user: findUser, type: day, plan: plan });
    const prevSession = prevSessions[prevSessions.length - 1];
    const newTraining = yield Training_1.default.create({ user: findUser, type: day, exercises: exercises, createdAt: date, plan: plan });
    if (prevSessions.length > 0)
        yield User_1.default.findByIdAndUpdate(id, { elo: findUser.elo += calculateElo(newTraining, prevSession) });
    if (newTraining)
        res.status(200).send({ msg: 'Training added' });
    else
        res.status(404).send({ msg: 'Error, We didnt add your training!' });
});
exports.getTrainingHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const findUser = yield User_1.default.findById(id);
    if (findUser) {
        const trainings = yield Training_1.default.find({ user: findUser });
        const reverseTraining = trainings.reverse();
        if (trainings.length > 0)
            return res.status(200).send({ trainingHistory: reverseTraining });
        else
            return res.status(404).send({ msg: 'You dont have trainings!' });
    }
    else
        return res.status(404).send({ msg: 'Error, we dont find You in our database. Please logout and login one more time.' });
});
exports.getTraining = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const findUser = yield User_1.default.findById(id);
    if (!findUser)
        return res.status(404).send({ msg: 'Error, we dont find you in our database.' });
    const trainings = yield Training_1.default.find({ user: findUser });
    const training = trainings.filter((training) => compareDates(new Date(req.body.createdAt), new Date(training.createdAt)));
    if (training.length < 1)
        return res.status(404).send({ msg: 'Error, we dont find training with send date' });
    return res.status(200).send(training[0]);
});
exports.getCurrentTrainingSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const findTraining = yield Training_1.default.findById(id);
    if (findTraining) {
        return res.status(200).send({ training: findTraining });
    }
    else
        return res.status(404).send({ msg: 'We dont find your training session!, Please logout and login one more time' });
});
exports.getPreviousTrainingSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const findUser = yield User_1.default.findById(userId);
    const trainingType = req.params.day;
    const prevSession = yield Training_1.default.find({ user: findUser, type: trainingType });
    if (prevSession)
        return res.status(200).send({ prevSession: prevSession[prevSession.length - 1] });
    return res.status(404).send({ msg: 'Didnt find previous session training' });
});
exports.checkPreviousTrainingSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const findUser = yield User_1.default.findById(userId);
    const trainingType = req.params.day;
    const plan = findUser.plan;
    const prevSessions = yield Training_1.default.find({ user: findUser, type: trainingType, plan: plan });
    const prevSession = prevSessions[prevSessions.length - 1];
    if (prevSession)
        return res.status(200).send({ msg: 'Yes' });
    else
        return res.status(404).send({ msg: 'No' });
});
const calculateElo = (newTraining, prevTraining) => {
    let score = 0;
    newTraining.exercises.forEach((ele, index) => {
        let currentScore;
        try {
            prevTraining.exercises[index].score !== "0" ?
                currentScore = parseFloat(ele.score) - parseFloat(prevTraining.exercises[index].score) : currentScore = 0;
        }
        catch (_a) {
            currentScore = 0;
        }
        if (currentScore > 100)
            currentScore = 100;
        score += currentScore;
    });
    return score;
};
const compareDates = (firstDate, secondDate) => (firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate());
