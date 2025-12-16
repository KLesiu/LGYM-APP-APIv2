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
import { middlewareAuth,middlewareAuthLocal } from "../middlewares/auth";
import { authLimiter } from "../middlewares/rateLimiters";


Router.post("/register", register);
Router.post("/login",authLimiter, middlewareAuthLocal,login);
Router.get("/:id/isAdmin", isAdmin);
Router.get("/checkToken",middlewareAuth,getUserInfo);
Router.get("/getUsersRanking", getUsersRanking);
Router.get("/userInfo/:id/getUserEloPoints", getUserElo);
Router.get("/deleteAccount", middlewareAuth, deleteAccount);
Router.post("/changeVisibilityInRanking", middlewareAuth, changeVisibilityInRanking);

export default Router;
