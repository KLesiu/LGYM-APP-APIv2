import Router from "./configRouter";
import { createPlanDay,updatePlanDay,getPlanDay ,getPlanDays, getPlanDaysTypes} from "../controllers/planDayController";

Router.post("/planDay/:id/createPlanDay",createPlanDay);
Router.post("/planDay/:id/updatePlanDay",updatePlanDay);
Router.get("/planDay/:id/getPlanDay",getPlanDay);
Router.get("/planDay/:id/getPlanDays",getPlanDays);
Router.get("/planDay/:id/getPlanDaysTypes",getPlanDaysTypes)

module.exports = Router;