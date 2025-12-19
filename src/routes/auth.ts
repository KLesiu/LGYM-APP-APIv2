import {
  register,
  login,
  isAdmin,
  getUserInfo,
  getUserElo,
  getUsersRanking,
  deleteAccount,
  changeVisibilityInRanking,
} from "../controllers/userController";
import Router from "./configRouter";
import { middlewareAuthLocal } from "../middlewares/auth";
import { authLimiter } from "../middlewares/rateLimiters";


Router.post("/register", register);
Router.post("/login",authLimiter, middlewareAuthLocal,login);
Router.get("/:id/isAdmin", isAdmin);
Router.get("/checkToken",getUserInfo);
Router.get("/getUsersRanking", getUsersRanking);
Router.get("/userInfo/:id/getUserEloPoints", getUserElo);
Router.get("/deleteAccount", deleteAccount);
Router.post("/changeVisibilityInRanking", changeVisibilityInRanking);

export default Router;
