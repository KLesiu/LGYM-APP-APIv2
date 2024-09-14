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
exports.updateMainRecords = exports.deleteMainRecords = exports.getLastMainRecords = exports.getMainRecordsHistory = exports.addNewRecords = void 0;
const User_1 = __importDefault(require("../models/User"));
const Message_1 = require("../enums/Message");
const MainRecords_1 = __importDefault(require("../models/MainRecords"));
const Exercise_1 = __importDefault(require("../models/Exercise"));
const addNewRecords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const findUser = yield User_1.default.findById(id);
    if (!findUser || !Object.keys(findUser).length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const findExercise = yield Exercise_1.default.findById(req.body.exercise);
    if (!findExercise || !Object.keys(findExercise).length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const mainRecords = yield MainRecords_1.default.create({
        user: findUser,
        exercise: findExercise,
        weight: req.body.weight,
        date: req.body.date
    });
    if (mainRecords)
        res.status(200).send({ msg: Message_1.Message.Created });
    else
        res.status(404).send({ msg: Message_1.Message.TryAgain });
});
exports.addNewRecords = addNewRecords;
const getMainRecordsHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const findUser = yield User_1.default.findById(id);
    if (!findUser || !Object.keys(findUser).length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const mainRecordsHistory = yield MainRecords_1.default.find({ user: findUser });
    if (mainRecordsHistory.length < 1)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    return res.status(200).send(mainRecordsHistory.reverse());
});
exports.getMainRecordsHistory = getMainRecordsHistory;
const getLastMainRecords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const findUser = yield User_1.default.findById(id);
    if (!findUser || !Object.keys(findUser).length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const mainRecordsHistory = yield MainRecords_1.default.find({ user: findUser });
    if (mainRecordsHistory.length < 1)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const lastMainRecords = mainRecordsHistory.reduce((acc, curr) => {
        if (!acc || curr.date > acc.date) {
            return curr;
        }
        else {
            return acc;
        }
    });
    return res.status(200).send(lastMainRecords);
});
exports.getLastMainRecords = getLastMainRecords;
const deleteMainRecords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const findMainRecords = yield MainRecords_1.default.findByIdAndDelete(id);
    if (!findMainRecords)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    return res.status(200).send({ msg: Message_1.Message.Deleted });
});
exports.deleteMainRecords = deleteMainRecords;
const updateMainRecords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const findUser = yield User_1.default.findById(id);
    if (!findUser || !Object.keys(findUser).length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const findMainRecords = yield MainRecords_1.default.findById(req.body._id);
    if (!findMainRecords)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const findExercise = yield Exercise_1.default.findById(req.body.exercise);
    if (!findExercise || !Object.keys(findExercise).length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const updatedMainRecords = yield MainRecords_1.default.findByIdAndUpdate(id, {
        user: findUser,
        exercise: findExercise,
        weight: req.body.weight,
        date: req.body.date
    });
    if (updatedMainRecords)
        return res.status(200).send({ msg: Message_1.Message.Updated });
    else
        return res.status(404).send({ msg: Message_1.Message.TryAgain });
});
exports.updateMainRecords = updateMainRecords;
