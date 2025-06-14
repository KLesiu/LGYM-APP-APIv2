import { createNewAppVersion, getAppVersion } from "../controllers/appVersionController";
import Router from "./configRouter";

Router.post("/appConfig/getAppVersion",getAppVersion)
Router.post("/appConfig/createNewAppVersion/:id",createNewAppVersion)

module.exports = Router;