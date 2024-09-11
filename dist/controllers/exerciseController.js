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
const Exercise_1 = __importDefault(require("../models/Exercise"));
const Message_1 = require("../enums/Message");
const User_1 = __importDefault(require("../models/User"));
exports.addExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const bodyPart = req.body.bodyPart;
    const description = req.body.description;
    const image = req.body.image;
    if (!name || !bodyPart)
        return res.status(400).send({ msg: 'Name and body part are required!' });
    const exercise = yield Exercise_1.default.create({ name: name, bodyPart: bodyPart, description: description, image: image });
    if (exercise)
        return res.status(200).send({ msg: Message_1.Message.Created });
    else
        return res.status(400).send({ msg: Message_1.Message.TryAgain });
});
exports.addUserExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const bodyPart = req.body.bodyPart;
    const description = req.body.description;
    const image = req.body.image;
    if (!name || !bodyPart)
        return res.status(400).send({ msg: 'Name and body part are required!' });
    const user = yield User_1.default.findById(req.params.id);
    if (!user || !Object.keys(user).length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const exercise = yield Exercise_1.default.create({ name: name, bodyPart: bodyPart, description: description, image: image, user: user });
    if (exercise)
        return res.status(200).send({ msg: Message_1.Message.Created });
    else
        return res.status(400).send({ msg: Message_1.Message.TryAgain });
});
exports.deleteExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.id)
        return res.status(400).send({ msg: Message_1.Message.FieldRequired });
    yield Exercise_1.default.findByIdAndDelete(req.body.id).exec();
    return res.status(200).send({ msg: Message_1.Message.Deleted });
});
exports.updateExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.id)
        return res.status(400).send({ msg: Message_1.Message.FieldRequired });
    yield Exercise_1.default.findByIdAndUpdate(req.body.id, req.body.exercise).exec();
    return res.status(200).send({ msg: Message_1.Message.Updated });
});
exports.getAllExercises = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const exercises = yield Exercise_1.default.find({});
    if (exercises.length > 0)
        return res.status(200).send(exercises);
    else
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
});
exports.getExerciseByBodyPart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bodyPart = req.body.bodyPart;
    const exercises = yield Exercise_1.default.find({ bodyPart: bodyPart });
    if (exercises.length > 0)
        return res.status(200).send(exercises);
    else
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
});
