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
const PlanHelpers_1 = require("../helpers/PlanHelpers");
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
exports.setPlanConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const days = +req.body.days;
    const name = req.body.name;
    const id = req.params.id;
    if (!name || !days)
        return res.send({ msg: Message_1.Message.FieldRequired });
    if (days < 1 || days > 7)
        return res.send({ msg: Message_1.Message.ChooseDays });
    const findUser = yield User_1.default.findById(id);
    const currentPlan = yield Plan_1.default.create({
        user: findUser,
        name: name,
        trainingDays: days,
    });
    yield findUser.updateOne({ plan: currentPlan });
    return res.send({ msg: Message_1.Message.Created });
});
const setPlanShared = (user, planConfig) => __awaiter(void 0, void 0, void 0, function* () {
    const currentPlan = yield Plan_1.default.create({
        user: user,
        name: planConfig.name,
        trainingDays: planConfig.trainingDays,
    });
    yield user.updateOne({ plan: currentPlan });
    const days = planConfig.days;
    const findPlan = yield Plan_1.default.findOne({ user: user });
    yield (0, PlanHelpers_1.updatePlan)(findPlan, planConfig.trainingDays, days);
});
exports.setPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const findUser = yield User_1.default.findById(id);
    const findPlan = yield Plan_1.default.findOne({ user: findUser });
    const days = req.body.days.days;
    const result = yield (0, PlanHelpers_1.updatePlan)(findPlan, days.length, days);
    return res.send(result);
});
exports.getPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const findUser = yield User_1.default.findById(id);
    const findPlan = yield Plan_1.default.findOne({ user: findUser });
    if (findPlan)
        return res
            .status(200)
            .send({
            data: {
                planA: findPlan.planA,
                planB: findPlan.planB,
                planC: findPlan.planC,
                planD: findPlan.planD,
                planE: findPlan.planE,
                planF: findPlan.planF,
                planG: findPlan.planG,
            },
        });
    else
        return res.status(404).send({ data: Message_1.Message.DidntFind });
});
exports.deletePlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const findUser = yield User_1.default.findById(id);
    const deletedPlan = yield Plan_1.default.findOneAndDelete({ user: findUser });
    yield findUser.updateOne({ $unset: { plan: 1 } }, { new: true });
    if (deletedPlan)
        return res.status(200).send({ msg: Message_1.Message.Deleted });
    else
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
});
exports.getSharedPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(req.params.id);
    const name = req.body.userName;
    const findUser = yield User_1.default.findOne({ name: name });
    if (!findUser || name === user.name)
        return;
    const userPlan = yield Plan_1.default.findOne({ user: findUser });
    const sharedPlan = {
        name: userPlan.name,
        days: [
            { exercises: userPlan.planA },
            { exercises: userPlan.planB },
            { exercises: userPlan.planC },
            { exercises: userPlan.planD },
            { exercises: userPlan.planE },
            { exercises: userPlan.planF },
            { exercises: userPlan.planG },
        ],
        trainingDays: userPlan.trainingDays,
    };
    yield setPlanShared(user, sharedPlan);
    return res.status(200).send({ msg: "Added" });
});
