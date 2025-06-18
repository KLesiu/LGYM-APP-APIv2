import { checkJwtToken } from "./../middlewares/auth";
import { Request, Response } from "express";
import {
  register,
  login,
  isAdmin,
  getUserInfo,
  getUserElo,
  getUsersRanking,
} from "../controllers/userController";
const passport = require("passport");
import Router from "./configRouter";
import { UserEntityStatics } from "./../models/User";
import { Message } from "../enums/Message";
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
  checkJwtToken,
  (
    req: Request,
    res: Response<{ isValid: boolean; user: UserEntityStatics | undefined }>
  ) => {
    return res.json({ isValid: true, user: req.user });
  }
);
Router.get("/getUsersRanking", getUsersRanking);
Router.get("/userInfo/:id/getUserEloPoints", getUserElo);

module.exports = Router;
