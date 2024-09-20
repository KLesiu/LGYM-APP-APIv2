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
exports.getPlanDays = exports.getPlanDay = exports.updatePlanDay = exports.createPlanDay = void 0;
const Plan_1 = __importDefault(require("../models/Plan"));
const Message_1 = require("../enums/Message");
const PlanDay_1 = __importDefault(require("../models/PlanDay"));
const Exercise_1 = __importDefault(require("../models/Exercise"));
const createPlanDay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const findPlan = yield Plan_1.default.findById(id);
    if (!findPlan || !Object.keys(findPlan).length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const name = req.body.name;
    const exercises = req.body.exercises;
    if (!name || !exercises || !exercises.length)
        return res.status(400).send({ msg: Message_1.Message.FieldRequired });
    yield PlanDay_1.default.create({
        plan: findPlan,
        name: name,
        exercises: exercises
    });
    return res.status(200).send({ msg: Message_1.Message.Created });
});
exports.createPlanDay = createPlanDay;
const updatePlanDay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const exercises = req.body.exercises;
    if (!name || !exercises || !exercises.length)
        return res.status(400).send({ msg: Message_1.Message.FieldRequired });
    const id = req.body._id;
    if (!id)
        return res.status(400).send({ msg: Message_1.Message.DidntFind });
    const findPlanDay = yield PlanDay_1.default.findById(id);
    if (!findPlanDay || !Object.keys(findPlanDay).length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    yield findPlanDay.updateOne({ name: name, exercises: exercises });
    return res.status(200).send({ msg: Message_1.Message.Updated });
});
exports.updatePlanDay = updatePlanDay;
const getPlanDay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const findPlanDay = yield PlanDay_1.default.findById(id);
    if (!findPlanDay || !Object.keys(findPlanDay).length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const planDay = {
        _id: findPlanDay._id,
        name: findPlanDay.name,
        exercises: findPlanDay.exercises
    };
    return res.status(200).send(planDay);
});
exports.getPlanDay = getPlanDay;
const getPlanDays = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        // Znalezienie planu
        const findPlan = yield Plan_1.default.findById(id);
        if (!findPlan || !Object.keys(findPlan).length) {
            return res.status(404).send({ msg: Message_1.Message.DidntFind });
        }
        // Znalezienie dni planu
        const findPlanDays = yield PlanDay_1.default.find({ plan: findPlan });
        if (!findPlanDays || !findPlanDays.length) {
            return res.status(404).send({ msg: Message_1.Message.DidntFind });
        }
        // Mapowanie przez dni planu
        const planDays = yield Promise.all(findPlanDays.map((planDay) => __awaiter(void 0, void 0, void 0, function* () {
            // Mapowanie przez ćwiczenia
            const exercises = yield Promise.all(planDay.exercises.map((exercise) => __awaiter(void 0, void 0, void 0, function* () {
                const findExercise = yield Exercise_1.default.findById(exercise.exercise);
                // Zwrot ćwiczenia po znalezieniu
                return {
                    series: exercise.series,
                    reps: exercise.reps,
                    exercise: findExercise, // Tutaj masz cały obiekt ćwiczenia
                };
            })));
            // Zwrot pojedynczego dnia planu z pełnymi danymi o ćwiczeniach
            return {
                _id: planDay._id,
                name: planDay.name,
                exercises: exercises,
            };
        })));
        // Zwrot poprawnych danych z planem dni
        return res.status(200).send(planDays);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ msg: 'Server error' });
    }
});
exports.getPlanDays = getPlanDays;
