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
exports.getEloRegistry = void 0;
const Message_1 = require("../enums/Message");
const EloRegistry_1 = __importDefault(require("../models/EloRegistry"));
const User_1 = __importDefault(require("../models/User"));
const getEloRegistry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(req.params.id);
    if (!user || !Object.keys(user).length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const eloRegistry = yield EloRegistry_1.default.find({ user: user._id }).sort({
        date: 1,
    });
    const options = { month: "2-digit", day: "2-digit" };
    const eloRegistryBaseChart = eloRegistry.map((elo) => ({
        _id: elo._id,
        value: elo.elo,
        date: new Intl.DateTimeFormat("en-US", options).format(new Date(elo.date)),
    }));
    if (eloRegistry.length > 0)
        return res.status(200).send(eloRegistryBaseChart);
    else
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
});
exports.getEloRegistry = getEloRegistry;
