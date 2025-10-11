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
exports.changeVisibilityInRanking = exports.deleteAccount = exports.updateUserElo = exports.getUsersRanking = exports.getUserElo = exports.getUserInfo = exports.isAdmin = exports.login = exports.register = exports.ranks = void 0;
const User_1 = __importDefault(require("../models/User"));
const Message_1 = require("../enums/Message");
const EloRegistry_1 = __importDefault(require("../models/EloRegistry"));
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.ranks = [
    { name: "Junior 1", needElo: 0 }, // 0-1000
    { name: "Junior 2", needElo: 1001 }, //1001 - 2500
    { name: "Junior 3", needElo: 2500 }, //2500 - 4000
    { name: "Mid 1", needElo: 6000 }, //6000 - 8000
    { name: "Mid 2", needElo: 8000 }, // 8000 - 12000
    { name: "Mid 3", needElo: 12000 }, // 12000 - 15000
    { name: "Pro 1", needElo: 15000 }, // 15000 - 20000
    { name: "Pro 2", needElo: 20000 }, // 20 000 - 24 000
    { name: "Pro 3", needElo: 24000 }, // 24 000 - 30 000
    { name: "Champ", needElo: 30000 }, // 30 000 - to the sky
];
const register = [
    body("name").trim().isLength({ min: 1 }).withMessage(Message_1.Message.NameIsRequired),
    body("email").isEmail().withMessage(Message_1.Message.EmailInvalid),
    body("password").isLength({ min: 6 }).withMessage(Message_1.Message.PasswordMin),
    body("cpassword")
        .custom((value, { req }) => value === req.body.password)
        .withMessage(Message_1.Message.SamePassword),
    asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(404).send({
                msg: errors.array()[0].msg,
            });
        }
        const name = req.body.name;
        const admin = false;
        const email = req.body.email;
        const password = req.body.password;
        const isVisibleInRanking = (_a = req.body.isVisibleInRanking) !== null && _a !== void 0 ? _a : true;
        const existingUser = yield User_1.default.findOne({
            $or: [{ name: name }, { email: email }],
        }).exec();
        if (existingUser) {
            if (existingUser.name === name) {
                return res.status(404).send({ msg: Message_1.Message.UserWithThatName });
            }
            if (existingUser.email === email) {
                return res.status(404).send({ msg: Message_1.Message.UserWithThatEmail });
            }
        }
        const user = new User_1.default({
            name: name,
            admin: admin,
            email: email,
            isVisibleInRanking: isVisibleInRanking,
            profileRank: "Junior 1",
        });
        yield User_1.default.register(user, password);
        yield EloRegistry_1.default.create({ user: user._id, date: new Date(), elo: 1000 });
        res.status(200).send({ msg: Message_1.Message.Created });
    })),
];
exports.register = register;
const login = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });
        const elo = yield getInformationAboutElo(req.user._id);
        const userInfo = {
            name: req.user.name,
            _id: `${req.user._id}`,
            email: req.user.email,
            avatar: req.user.avatar,
            admin: req.user.admin,
            profileRank: req.user.profileRank,
            createdAt: req.user.createdAt,
            updatedAt: req.user.updatedAt,
            elo: elo || 1000,
            nextRank: getNextRank(req.user.profileRank),
            isDeleted: req.user.isDeleted,
            isTester: req.user.isTester || false,
            isVisibleInRanking: req.user.isVisibleInRanking,
        };
        return res.status(200).send({ token: token, req: userInfo });
    });
};
exports.login = login;
const deleteAccount = function (req, res) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        yield User_1.default.updateOne({ _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }, {
            $set: {
                email: `anonymized_${(_b = req.user) === null || _b === void 0 ? void 0 : _b._id}@example.com`,
                name: "anonymized_user_" + ((_c = req.user) === null || _c === void 0 ? void 0 : _c._id),
                isDeleted: true,
            },
        });
        return res.status(200).send({ msg: Message_1.Message.Deleted });
    });
};
exports.deleteAccount = deleteAccount;
const isAdmin = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const admin = yield User_1.default.findById(req.params.id);
        const result = admin && admin.admin ? true : false;
        return res.status(200).send(result);
    });
};
exports.isAdmin = isAdmin;
const getUserInfo = function (req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const UserInfo = req.user;
        if (!UserInfo)
            return res.status(404).send({ msg: Message_1.Message.DidntFind });
        const nextRank = getNextRank(UserInfo.profileRank);
        const elo = (_a = (yield getInformationAboutElo(UserInfo._id))) !== null && _a !== void 0 ? _a : 1000;
        const userInfoWithRank = Object.assign(Object.assign({}, UserInfo.toObject()), { nextRank: nextRank || null, elo: elo });
        if (UserInfo)
            return res.status(200).send(userInfoWithRank);
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    });
};
exports.getUserInfo = getUserInfo;
const getNextRank = (currentRank) => {
    let nextRank = exports.ranks[0];
    exports.ranks.forEach((rank, index) => {
        if (rank.name === currentRank) {
            nextRank = exports.ranks[index + 1];
        }
    });
    return nextRank;
};
const getInformationAboutElo = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userElo = yield EloRegistry_1.default.findOne({ user: userId }).sort({
        date: -1,
    });
    return (userElo === null || userElo === void 0 ? void 0 : userElo.elo) || null;
});
const getUsersRanking = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield User_1.default.aggregate([
            {
                $match: {
                    isTester: { $ne: true },
                    isDeleted: { $ne: true },
                    isVisibleInRanking: { $ne: false }
                },
            },
            {
                $lookup: {
                    from: "eloregistries", // Nazwa kolekcji EloRegistry
                    let: { userId: "$_id" }, // Definicja zmiennej `userId` z `_id` użytkownika
                    pipeline: [
                        { $match: { $expr: { $eq: ["$user", "$$userId"] } } }, // Dopasowanie do użytkownika
                        { $sort: { date: -1 } }, // Sortowanie malejąco po `date`, najnowszy jako pierwszy
                        { $limit: 1 }, // Pobranie tylko najnowszego wpisu
                    ],
                    as: "eloRecords", // Wynik jako tablica `eloRecords` (będzie miała maksymalnie jeden element)
                },
            },
            {
                $addFields: {
                    // Wyciągnięcie najnowszego `elo` lub ustawienie wartości domyślnej 1000, jeśli brak wpisów
                    elo: { $ifNull: [{ $arrayElemAt: ["$eloRecords.elo", 0] }, 1000] },
                },
            },
            {
                $sort: { elo: -1 }, // Sortowanie według elo malejąco
            },
            {
                $project: {
                    name: 1,
                    avatar: 1,
                    elo: 1,
                    profileRank: 1,
                },
            },
        ]);
        // Zwrócenie listy użytkowników lub komunikat błędu
        if (users.length)
            return res.status(200).send(users);
        else
            return res.status(404).send({ msg: Message_1.Message.DidntFind });
    });
};
exports.getUsersRanking = getUsersRanking;
const getUserElo = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const result = yield EloRegistry_1.default.findOne({ user: id })
            .sort({ date: -1 })
            .limit(1);
        if (!result)
            return res.status(404).send({ msg: Message_1.Message.DidntFind });
        return res.status(200).send({
            elo: result.elo,
        });
    });
};
exports.getUserElo = getUserElo;
const updateUserElo = (gainElo, currentElo, user, trainingId) => __awaiter(void 0, void 0, void 0, function* () {
    const newElo = gainElo + currentElo;
    // Znalezienie odpowiedniej rangi na podstawie wartości ELO
    const currentRank = exports.ranks.reduce((current, next) => {
        if (newElo >= next.needElo) {
            return next;
        }
        return current;
    }, exports.ranks[0]);
    // Znalezienie następnej rangi, jeśli istnieje
    const currentRankIndex = exports.ranks.findIndex((rank) => rank.name === currentRank.name);
    const nextRank = exports.ranks[currentRankIndex + 1] || null; // Jeśli nie ma wyższej rangi, zwróć null
    // Zaktualizowanie danych użytkownika w bazie danych
    yield user.updateOne({ profileRank: currentRank.name });
    yield EloRegistry_1.default.create({
        user: user._id,
        date: new Date(),
        elo: newElo,
        training: trainingId,
    });
    // Zwrócenie obecnej rangi i kolejnej rangi, jeśli istnieje
    return {
        currentRank: currentRank,
        nextRank: nextRank ? nextRank : null,
    };
});
exports.updateUserElo = updateUserElo;
const changeVisibilityInRanking = function (req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { isVisibleInRanking } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId)
            return res.status(400).send({ msg: Message_1.Message.DidntFind });
        yield User_1.default.updateOne({ _id: userId }, { isVisibleInRanking });
        return res.status(200).send({ msg: Message_1.Message.Updated });
    });
};
exports.changeVisibilityInRanking = changeVisibilityInRanking;
