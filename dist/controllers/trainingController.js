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
const User_1 = __importDefault(require("./../models/User"));
const DatesHelpers_1 = require("./../helpers/DatesHelpers");
const userController_1 = require("./userController");
const Message_1 = require("../enums/Message");
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
    const training = trainings.filter((training) => (0, DatesHelpers_1.compareDates)(new Date(req.body.createdAt), new Date(training.createdAt)));
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
exports.getLastTrainingSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const findUser = yield User_1.default.findById(id);
    if (!findUser)
        return res.status(404).send({ msg: 'Error we dont find you! Please logout and login one more time' });
    const trainings = yield Training_1.default.find({ user: findUser });
    if (!trainings || trainings.length === 0)
        return res.status(404).send({ msg: 'You dont have trainings!' });
    return res.status(200).send(trainings.reverse()[0]);
});
exports.getPreviousTrainingSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const findUser = yield User_1.default.findById(userId);
    const trainingType = req.params.day;
    const currentPlan = yield Plan_1.default.find({ user: userId });
    const prevSession = yield Training_1.default.find({ user: findUser, type: trainingType, plan: currentPlan });
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
exports.getInfoAboutRankAndElo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const findUser = yield User_1.default.findById(userId);
    const userRank = findUser.profileRank;
    const userElo = findUser.elo;
    const nextRankLevel = findRank(userElo);
    return res.status(200).send({ elo: userElo, rank: userRank, nextRank: nextRankLevel === null || nextRankLevel === void 0 ? void 0 : nextRankLevel.rank, nextRankElo: nextRankLevel === null || nextRankLevel === void 0 ? void 0 : nextRankLevel.elo, startRankElo: nextRankLevel === null || nextRankLevel === void 0 ? void 0 : nextRankLevel.startElo });
});
exports.getTrainingDates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    // const interval= changeDays(req.body.date,10)
    const trainings = yield Training_1.default.find({ user: userId }); // Pobierz wszystkie treningi użytkownika
    if (trainings.length < 1)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const trainingsDates = {
        dates: trainings.map((ele) => new Date(ele.createdAt))
    };
    return res.status(200).send({
        dates: trainingsDates.dates
    });
});
exports.getBestTenUsersFromElo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User_1.default.find().sort({ elo: -1 }).limit(10);
    if (users.length < 1)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const usersRanking = users.map((ele, index) => { return { user: ele, position: index + 1 }; });
    return res.status(200).send(usersRanking);
});
const findRank = (elo) => {
    for (let i = 0; i < userController_1.ranks.length; i++) {
        if (elo <= userController_1.ranks[i].maxElo) {
            return {
                elo: userController_1.ranks[i].maxElo,
                rank: userController_1.ranks[i + 1].name,
                startElo: i === 0 ? 0 : userController_1.ranks[i - 1].maxElo
            };
        }
    }
    return null;
};
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
