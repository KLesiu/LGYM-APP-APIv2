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
exports.createNewAppVersion = exports.getAppVersion = void 0;
const Platforms_1 = require("../enums/Platforms");
const Message_1 = require("../enums/Message");
const AppConfig_1 = __importDefault(require("../models/AppConfig"));
const User_1 = __importDefault(require("../models/User"));
const getAppVersion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { platform } = req.body;
    if (!platform || !Object.values(Platforms_1.Platforms).includes(platform)) {
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    }
    const appConfig = yield AppConfig_1.default.findOne({
        platform,
    }, {
        minRequiredVersion: 1,
        latestVersion: 1,
        forceUpdate: 1,
        updateUrl: 1,
        releaseNotes: 1,
        _id: 0,
    })
        .sort({ createdAt: -1 })
        .lean();
    if (!appConfig || !Object.keys(appConfig).length) {
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    }
    return res.status(200).send(appConfig);
});
exports.getAppVersion = getAppVersion;
const createNewAppVersion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(req.params.id);
    if (!user || !user.admin) {
        return res.status(403).send({ msg: Message_1.Message.Forbidden });
    }
    if (!req.body || !Object.keys(req.body).length) {
        return res.status(400).send({ msg: Message_1.Message.FieldRequired });
    }
    const newAppConfig = new AppConfig_1.default(req.body);
    yield newAppConfig.save();
    return res.status(201).send({ msg: Message_1.Message.Created });
});
exports.createNewAppVersion = createNewAppVersion;
