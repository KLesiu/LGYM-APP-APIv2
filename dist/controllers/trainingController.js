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
exports.getLastTraining = exports.addTraining = void 0;
require("dotenv").config();
const Training_1 = __importDefault(require("../models/Training"));
const User_1 = __importDefault(require("./../models/User"));
const Message_1 = require("../enums/Message");
const exercisesScoresController_1 = require("./exercisesScoresController");
const addTraining = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.params.id;
    const planDay = req.body.type;
    const createdAt = req.body.createdAt;
    const response = yield Training_1.default.create({
        user: user,
        type: planDay,
        createdAt: createdAt,
    });
    if (!response)
        return res.status(404).send({ msg: Message_1.Message.TryAgain });
    const exercises = req.body.exercises.map((ele) => {
        return Object.assign(Object.assign({}, ele), { training: response._id, user: user, date: createdAt });
    });
    const result = yield Promise.all(exercises.map((ele) => (0, exercisesScoresController_1.addExercisesScores)(ele)));
    yield response.updateOne({ exercises: result });
    return res.status(200).send({ msg: Message_1.Message.Created });
});
exports.addTraining = addTraining;
const getLastTraining = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user = yield User_1.default.findById(id);
    if (!user)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const training = yield Training_1.default.aggregate([
        {
            $match: { user: user._id },
        },
        {
            $sort: { createdAt: -1 },
        },
        {
            $limit: 1,
        },
        {
            $lookup: {
                from: "plandays",
                localField: "type",
                foreignField: "_id",
                as: "planDay",
            },
        },
        {
            $unwind: "$planDay",
        },
        {
            $project: {
                type: 1,
                createdAt: 1,
                "planDay.name": 1,
            },
        },
    ]);
    if (!training)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    return res.status(200).send(training[0]);
});
exports.getLastTraining = getLastTraining;
