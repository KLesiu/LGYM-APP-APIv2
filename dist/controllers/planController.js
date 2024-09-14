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
exports.getPlanConfig = exports.updatePlan = exports.createPlan = void 0;
const Plan_1 = __importDefault(require("../models/Plan"));
const User_1 = __importDefault(require("../models/User"));
const Message_1 = require("../enums/Message");
require("dotenv").config();
const createPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const findUser = yield User_1.default.findById(id);
    if (!findUser || !Object.keys(findUser).length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const days = req.body.trainingDays;
    const name = req.body.name;
    if (!name || !days)
        return res.status(400).send({ msg: Message_1.Message.FieldRequired });
    if (days < 1 || days > 7)
        return res.send({ msg: Message_1.Message.ChooseDays });
    const currentPlan = yield Plan_1.default.create({
        user: findUser,
        name: name,
        trainingDays: days,
    });
    yield findUser.updateOne({ plan: currentPlan });
    return res.status(200).send({ msg: Message_1.Message.Created });
});
exports.createPlan = createPlan;
const updatePlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const days = req.body.trainingDays;
    const name = req.body.name;
    if (!name || !days)
        return res.status(400).send({ msg: Message_1.Message.FieldRequired });
    if (days < 1 || days > 7)
        return res.send({ msg: Message_1.Message.ChooseDays });
    const findPlan = yield Plan_1.default.findById(req.body._id);
    if (!findPlan || !Object.keys(findPlan).length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    yield findPlan.updateOne({ name: name, trainingDays: days });
    return res.status(200).send({ msg: Message_1.Message.Updated });
});
exports.updatePlan = updatePlan;
const getPlanConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const findUser = yield User_1.default.findById(id);
    if (!findUser || !Object.keys(findUser).length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const findPlan = yield Plan_1.default.findOne({ user: findUser });
    if (!findPlan || !Object.keys(findPlan).length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const planConfig = {
        _id: findPlan._id,
        name: findPlan.name,
        trainingDays: findPlan.trainingDays,
    };
    return res.status(200).send(planConfig);
});
exports.getPlanConfig = getPlanConfig;
