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
exports.editGym = exports.getGym = exports.getGyms = exports.deleteGym = exports.addGym = void 0;
const Gym_1 = __importDefault(require("../models/Gym"));
const User_1 = __importDefault(require("../models/User"));
const Message_1 = require("../enums/Message");
const Training_1 = __importDefault(require("../models/Training"));
const addGym = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(req.params.id);
    if (!user || !Object.keys(user).length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const gym = Object.assign(Object.assign({}, req.body), { user: user._id });
    if (!gym.name)
        return res.status(400).send({ msg: Message_1.Message.FieldRequired });
    yield Gym_1.default.create(gym);
    return res.status(200).send({ msg: Message_1.Message.Created });
});
exports.addGym = addGym;
const deleteGym = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id)
        return res.status(400).send({ msg: Message_1.Message.FieldRequired });
    yield Gym_1.default.findByIdAndUpdate(req.params.id, { isDeleted: true });
    return res.status(200).send({ msg: Message_1.Message.Deleted });
});
exports.deleteGym = deleteGym;
const getGyms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(req.params.id);
    if (!user || !Object.keys(user).length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const gyms = yield Gym_1.default.find({ user: user._id, isDeleted: false });
    const gymsWithTrainingData = yield Promise.all(gyms.map((gym) => __awaiter(void 0, void 0, void 0, function* () {
        const lastTraining = yield Training_1.default.findOne({ gym: gym._id })
            .sort({ createdAt: -1 })
            .populate("type", "name")
            .select("createdAt type");
        return {
            _id: gym._id,
            name: gym.name,
            address: gym.address,
            lastTrainingInfo: lastTraining
        };
    })));
    return res.status(200).send(gymsWithTrainingData);
});
exports.getGyms = getGyms;
const getGym = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id)
        return res.status(400).send({ msg: Message_1.Message.FieldRequired });
    const gym = yield Gym_1.default.findById(req.params.id);
    if (!gym)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const gymWithoutUser = {
        _id: gym._id,
        name: gym.name,
        address: gym.address
    };
    return res.status(200).send(gymWithoutUser);
});
exports.getGym = getGym;
const editGym = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body._id)
        return res.status(400).send({ msg: Message_1.Message.FieldRequired });
    yield Gym_1.default.findByIdAndUpdate(req.body._id, req.body);
    return res.status(200).send({ msg: Message_1.Message.Updated });
});
exports.editGym = editGym;
