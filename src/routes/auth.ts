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
import { middlewareAuth,middlewareAuthLocal } from "../middlewares/auth";


Router.post("/register", register);
Router.post("/login", middlewareAuthLocal,login);
Router.get("/:id/isAdmin", isAdmin);
Router.get("/checkToken",middlewareAuth,getUserInfo);
Router.get("/getUsersRanking", getUsersRanking);
Router.get("/userInfo/:id/getUserEloPoints", getUserElo);
Router.get("/deleteAccount", middlewareAuth, deleteAccount);
module.exports = Router;
