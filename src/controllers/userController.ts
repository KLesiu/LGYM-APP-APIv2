import User, { UserEntity, UserEntityStatics } from "../models/User";
import {
  RegisterUser,
  Rank,
  UserElo,
  UserInfo,
  UserBaseInfo,
} from "./../interfaces/User";
import ResponseMessage from "./../interfaces/ResponseMessage";
import { Request, Response } from "express";
import Params from "../interfaces/Params";
import { Message } from "../enums/Message";
import EloRegistry from "../models/EloRegistry";
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
require("dotenv").config();

export const ranks: Rank[] = [
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
  body("name").trim().isLength({ min: 1 }).withMessage(Message.NameIsRequired),
  body("email").isEmail().withMessage(Message.EmailInvalid),
  body("password").isLength({ min: 6 }).withMessage(Message.PasswordMin),
  body("cpassword")
    .custom(
      (
        value: string,
        { req }: { req: Request<{}, {}, { password: string }> }
      ) => value === req.body.password
    )
    .withMessage(Message.SamePassword),
  asyncHandler(
    async (
      req: Request<{}, {}, RegisterUser>,
      res: Response<ResponseMessage>
    ) => {
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
      const isVisibleInRanking = req.body.isVisibleInRanking ?? true;

      const existingUser = await User.findOne({
        $or: [{ name: name }, { email: email }],
      }).exec();

      if (existingUser) {
        if (existingUser.name === name) {
          return res.status(404).send({ msg: Message.UserWithThatName });
        }

        if (existingUser.email === email) {
          return res.status(404).send({ msg: Message.UserWithThatEmail });
        }
      }

      const user = new User({
        name: name,
        admin: admin,
        email: email,
        isVisibleInRanking: isVisibleInRanking,
        profileRank: "Junior 1",
      });
      await User.register(user, password);
      await EloRegistry.create({ user: user._id, date: new Date(), elo: 1000 });
      res.status(200).send({ msg: Message.Created });
    }
  ),
];

const login = async function (
  req: { user: UserEntity },
  res: Response<{ token: string; req: UserInfo }>
) {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  const elo = await getInformationAboutElo(req.user._id);
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
  } as UserInfo;
  return res.status(200).send({ token: token, req: userInfo });
};

const deleteAccount = async function (
  req: Request,
  res: Response<ResponseMessage>
) {
  await User.updateOne(
    { _id: req.user?._id },
    {
      $set: {
        email: `anonymized_${req.user?._id}@example.com`,
        name: "anonymized_user_" + req.user?._id,
        isDeleted: true,
      },
    }
  );
  return res.status(200).send({ msg: Message.Deleted });
};

const isAdmin = async function (
  req: Request<Params, {}, {}>,
  res: Response<boolean>
) {
  const admin = await User.findById(req.params.id);
  const result = admin && admin.admin ? true : false;
  return res.status(200).send(result);
};

const getUserInfo = async function (
  req: Request,
  res: Response<UserInfo | ResponseMessage>
) {
  const UserInfo = req.user;
  if (!UserInfo) return res.status(404).send({ msg: Message.DidntFind });
  const nextRank = getNextRank(UserInfo.profileRank)
  const elo = (await getInformationAboutElo(UserInfo._id)) ?? 1000;
  const userInfoWithRank = {
    ...UserInfo.toObject(),
    nextRank: nextRank || null,
    elo: elo,
  };
  if (UserInfo) return res.status(200).send(userInfoWithRank);
  return res.status(404).send({ msg: Message.DidntFind });
};

const getNextRank = (currentRank: string) => {
  let nextRank: Rank = ranks[0];
  ranks.forEach((rank, index) => {
    if (rank.name === currentRank) {
      nextRank = ranks[index + 1];
    }
  });
  return nextRank;
};

const getInformationAboutElo = async (userId: string) => {
  const userElo = await EloRegistry.findOne({ user: userId }).sort({
    date: -1,
  });
  return userElo?.elo || null;
};

const getUsersRanking = async function (
  req: Request,
  res: Response<UserBaseInfo[] | ResponseMessage>
) {
  const users: UserBaseInfo[] = await User.aggregate([
     {
        $match: {
          isTester: { $ne: true },
          isDeleted:  { $ne: true },
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
  if (users.length) return res.status(200).send(users);
  else return res.status(404).send({ msg: Message.DidntFind });
};


const getUserElo = async function (
  req: Request<Params, {}, {}>,
  res: Response<UserElo | ResponseMessage>
) {
  const id: string = req.params.id;
  const result = await EloRegistry.findOne({ user: id })
    .sort({ date: -1 })
    .limit(1);
  if (!result) return res.status(404).send({ msg: Message.DidntFind });
  return res.status(200).send({
    elo: result.elo,
  });
};

const updateUserElo = async (
  gainElo: number,
  currentElo: number,
  user: UserEntity,
  trainingId: string | undefined
) => {
  const newElo = gainElo + currentElo;
  // Znalezienie odpowiedniej rangi na podstawie wartości ELO
  const currentRank = ranks.reduce((current, next) => {
    if (newElo >= next.needElo) {
      return next;
    }
    return current;
  }, ranks[0]);

  // Znalezienie następnej rangi, jeśli istnieje
  const currentRankIndex = ranks.findIndex(
    (rank) => rank.name === currentRank.name
  );
  const nextRank = ranks[currentRankIndex + 1] || null; // Jeśli nie ma wyższej rangi, zwróć null

  // Zaktualizowanie danych użytkownika w bazie danych
  await user.updateOne({ profileRank: currentRank.name });
  await EloRegistry.create({
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
};


const changeVisibilityInRanking = async function (
  req: Request<{}, {}, { isVisibleInRanking: boolean }>,
  res: Response<ResponseMessage>
) {
  const { isVisibleInRanking } = req.body;
  const userId = req.user?._id;

  if (!userId) return res.status(400).send({ msg: Message.DidntFind });

  await User.updateOne({ _id: userId }, { isVisibleInRanking });

  return res.status(200).send({msg:Message.Updated});
};

export {
  register,
  login,
  isAdmin,
  getUserInfo,
  getUserElo,
  getUsersRanking,
  updateUserElo,
  deleteAccount,
  changeVisibilityInRanking
};
