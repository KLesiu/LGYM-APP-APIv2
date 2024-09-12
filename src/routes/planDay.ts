import Router from "./configRouter";
import { createPlanDay,updatePlanDay,getPlanDay } from "../controllers/planDayController";

Router.post("/planDay/:id/createPlanDay",createPlanDay);
Router.post("/planDay/:id/updatePlanDay",updatePlanDay);
Router.get("/planDay/:id/getPlanDay",getPlanDay);

module.exports = Router;