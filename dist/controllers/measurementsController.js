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
exports.getMeasurementsHistory = exports.getMeasurementDetails = exports.addMeasurement = void 0;
const User_1 = __importDefault(require("./../models/User"));
const Measurements_1 = __importDefault(require("./../models/Measurements"));
const Message_1 = require("../enums/Message");
const addMeasurement = () => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const findUser = yield User_1.default.findById(req.body.user);
    if (!findUser)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const measurement = yield Measurements_1.default.create({
        user: findUser,
        bodyPart: req.body.bodyPart,
        unit: req.body.unit,
        value: req.body.value
    });
    if (measurement)
        res.status(200).send({ msg: Message_1.Message.Created });
    else
        res.status(404).send({ msg: Message_1.Message.TryAgain });
});
exports.addMeasurement = addMeasurement;
const getMeasurementDetails = () => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const findMeasurement = yield Measurements_1.default.findById(id);
    if (!findMeasurement)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    return res.status(200).send(findMeasurement);
});
exports.getMeasurementDetails = getMeasurementDetails;
const getMeasurementsHistory = () => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const findUser = yield User_1.default.findById(id);
    const measurements = req.body.bodyPart ? yield Measurements_1.default.find({ user: findUser, bodyPart: req.body.bodyPart }) : yield Measurements_1.default.find({ user: findUser });
    if (measurements.length < 1)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    return res.status(200).send({ measurements: measurements.reverse() });
});
exports.getMeasurementsHistory = getMeasurementsHistory;
