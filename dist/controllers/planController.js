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
exports.generateShareCode = exports.copyPlan = exports.setNewActivePlan = exports.getPlansList = exports.checkIsUserHavePlan = exports.getPlanConfig = exports.updatePlan = exports.createPlan = void 0;
const Plan_1 = __importDefault(require("../models/Plan"));
const User_1 = __importDefault(require("../models/User"));
const Message_1 = require("../enums/Message");
const PlanDay_1 = __importDefault(require("../models/PlanDay"));
const Exercise_1 = __importDefault(require("../models/Exercise"));
const nanoid_1 = __importDefault(require("../config/nanoid"));
require("dotenv").config();
const createPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const findUser = yield User_1.default.findById(id);
    if (!findUser || !Object.keys(findUser).length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const name = req.body.name;
    const currentPlan = yield Plan_1.default.create({
        user: findUser,
        name: name,
        isActive: true,
    });
    yield findUser.updateOne({ plan: currentPlan });
    return res.status(200).send({ msg: Message_1.Message.Created });
});
exports.createPlan = createPlan;
const updatePlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    if (!name)
        return res.status(400).send({ msg: Message_1.Message.FieldRequired });
    const findPlan = yield Plan_1.default.findById(req.body._id);
    if (!findPlan || !Object.keys(findPlan).length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    yield findPlan.updateOne({ name: name });
    return res.status(200).send({ msg: Message_1.Message.Updated });
});
exports.updatePlan = updatePlan;
const getPlanConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const findUser = yield User_1.default.findById(id);
    if (!findUser || !Object.keys(findUser).length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const findPlan = yield Plan_1.default.findOne({ user: findUser, isActive: true });
    if (!findPlan || !Object.keys(findPlan).length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const planConfig = {
        _id: findPlan._id,
        name: findPlan.name,
        isActive: findPlan.isActive,
        shareCode: findPlan.shareCode
    };
    return res.status(200).send(planConfig);
});
exports.getPlanConfig = getPlanConfig;
const checkIsUserHavePlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const findUser = yield User_1.default.findById(id);
    if (!findUser || !Object.keys(findUser).length)
        return res.status(404).send(false);
    const plan = yield Plan_1.default.findOne({ user: findUser, isActive: true });
    if (!plan)
        return res.status(200).send(false);
    const planDay = yield PlanDay_1.default.findOne({ plan: plan._id, isDeleted: false });
    if (!planDay)
        return res.status(200).send(false);
    return res.status(200).send(true);
});
exports.checkIsUserHavePlan = checkIsUserHavePlan;
const getPlansList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const findUser = yield User_1.default.findById(userId);
    if (!findUser || !Object.keys(findUser).length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const plans = yield Plan_1.default.find({ user: findUser });
    if (!plans || !plans.length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const plansList = plans.map((plan) => ({
        _id: plan._id,
        name: plan.name,
        isActive: plan.isActive,
    }));
    return res.status(200).send(plansList);
});
exports.getPlansList = getPlansList;
const setNewActivePlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const planId = req.body._id;
    yield Plan_1.default.updateMany({ user: userId, _id: { $ne: planId } }, { $set: { isActive: false } });
    yield Plan_1.default.updateOne({ user: userId, _id: planId }, { $set: { isActive: true } });
    return res.status(200).send({ msg: Message_1.Message.Updated });
});
exports.setNewActivePlan = setNewActivePlan;
const copyPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userId)
        return res.status(401).send({ msg: Message_1.Message.Unauthorized });
    const { shareCode } = req.body;
    const planToCopy = yield Plan_1.default.findOne({ shareCode: shareCode });
    if (!planToCopy)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const planDaysToCopy = yield PlanDay_1.default.find({ plan: planToCopy._id, isDeleted: false });
    const newPlan = new Plan_1.default({
        user: req.user.id,
        name: planToCopy.name,
        isActive: true,
    });
    const userExerciseToAdd = [];
    const planDaysToAdd = [];
    for (const planDay of planDaysToCopy) {
        const exercisesToPlanDay = [];
        for (const exercise of planDay.exercises) {
            const findExercise = yield Exercise_1.default.findById(exercise.exercise);
            if (findExercise && findExercise.user) {
                const exerciseToAdd = new Exercise_1.default({
                    name: findExercise.name,
                    user: req.user.id,
                    bodyPart: findExercise.bodyPart,
                    description: findExercise.description,
                    image: findExercise.image
                });
                exercisesToPlanDay.push({
                    series: exercise.series,
                    reps: exercise.reps,
                    exercise: exerciseToAdd._id
                });
                userExerciseToAdd.push(exerciseToAdd);
            }
            else {
                exercisesToPlanDay.push({
                    series: exercise.series,
                    reps: exercise.reps,
                    exercise: exercise.exercise
                });
            }
        }
        const planDayToAdd = new PlanDay_1.default({
            name: planDay.name,
            plan: newPlan._id,
            exercises: exercisesToPlanDay
        });
        planDaysToAdd.push(planDayToAdd);
    }
    yield newPlan.save();
    yield Exercise_1.default.create(userExerciseToAdd);
    yield PlanDay_1.default.create(planDaysToAdd);
    return res.status(200).send({ msg: Message_1.Message.Created });
});
exports.copyPlan = copyPlan;
const generateShareCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const plansCodes = yield Plan_1.default.find().select("shareCode");
    const codesArray = plansCodes.map(plan => plan.shareCode);
    const regenerateCode = () => {
        const newCode = (0, nanoid_1.default)();
        if (codesArray.includes(newCode))
            return regenerateCode();
        return newCode;
    };
    const { planId } = req.body;
    const code = regenerateCode();
    yield Plan_1.default.updateOne({ _id: planId }, { shareCode: code });
    return res.status(200).send(code);
});
exports.generateShareCode = generateShareCode;
