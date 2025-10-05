import { Request, Response } from "express";
import {
  register,
  login,
  isAdmin,
  getUserInfo,
  getUserElo,
  getUsersRanking,
  deleteAccount,
} from "../controllers/userController";
import Router from "./configRouter";
import { UserEntity } from "./../models/User";
import { middlewareAuth } from "../middlewares/auth";
import { Message } from "../enums/Message";
const passport = require("passport");
Router.post("/register", register);
Router.post("/login", (req: any, res: any, next: any) => {
  passport.authenticate("local", { session: false }, (err: any, user: any) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ msg: Message.Unauthorized });
    }
    req.user = user;
    return login(req, res);
  })(req, res, next);
});
Router.get("/:id/isAdmin", isAdmin);
Router.get("/:id/getUserInfo", getUserInfo);
Router.get(
  "/checkToken",
  middlewareAuth,
  (
    req: Request,
    res: Response<{ isValid: boolean; user: UserEntity | undefined }>
  ) => {
    return res.json({ isValid: true, user: req.user });
  }
);
Router.get("/getUsersRanking", getUsersRanking);
Router.get("/userInfo/:id/getUserEloPoints", getUserElo);
Router.get("/deleteAccount", middlewareAuth, deleteAccount);
module.exports = Router;
