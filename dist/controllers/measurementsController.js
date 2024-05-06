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
const User_1 = __importDefault(require("./../models/User"));
const Measurements_1 = __importDefault(require("./../models/Measurements"));
const Message_1 = require("../enums/Message");
exports.addMeasurements = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const findUser = yield User_1.default.findById(id);
    const measurement = yield Measurements_1.default.create({
        user: findUser,
        weight: req.body.weight,
        neck: req.body.neck,
        chest: req.body.chest,
        biceps: req.body.biceps,
        waist: req.body.waist,
        abdomen: req.body.abdomen,
        hips: req.body.hips,
        thigh: req.body.thigh,
        calf: req.body.calf
    });
    if (measurement) {
        res.status(200).send({ msg: Message_1.Message.Created });
    }
    else
        res.status(404).send({ msg: Message_1.Message.TryAgain });
});
exports.getMeasurementsHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const findUser = yield User_1.default.findById(id);
    if (!findUser)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const measurementsHistory = yield Measurements_1.default.find({ user: findUser });
    if (measurementsHistory.length < 1)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    return res.status(200).send({ measurements: measurementsHistory.reverse() });
});
exports.getLastMeasurements = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const findUser = yield User_1.default.findById(id);
    if (!findUser)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const measurementsHistory = yield Measurements_1.default.find({ user: findUser });
    if (measurementsHistory.length < 1)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const lastMeasurements = measurementsHistory.reduce((acc, curr) => {
        if (!acc || curr.createdAt > acc.createdAt) {
            return curr;
        }
        else {
            return acc;
        }
    });
    const modifiedMeasurement = {
        weight: lastMeasurements.weight,
        neck: lastMeasurements.neck,
        chest: lastMeasurements.chest,
        biceps: lastMeasurements.biceps,
        waist: lastMeasurements.waist,
        abdomen: lastMeasurements.abdomen,
        hips: lastMeasurements.hips,
        thigh: lastMeasurements.thigh,
        calf: lastMeasurements.calf
    };
    return res.status(200).send(modifiedMeasurement);
});
