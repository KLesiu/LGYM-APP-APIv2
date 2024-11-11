import Router from "./configRouter";
import { createPlanDay,updatePlanDay,getPlanDay ,getPlanDays, getPlanDaysTypes,deletePlanDay} from "../controllers/planDayController";

Router.post("/planDay/:id/createPlanDay",createPlanDay);
Router.post("/planDay/updatePlanDay",updatePlanDay);
Router.get("/planDay/:id/getPlanDay",getPlanDay);
Router.get("/planDay/:id/getPlanDays",getPlanDays);
Router.get("/planDay/:id/getPlanDaysTypes",getPlanDaysTypes)
Router.get("/planDay/:id/deletePlanDay",deletePlanDay)

module.exports = Router;