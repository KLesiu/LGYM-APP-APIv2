import Router from "./configRouter";
import { createPlanDay,updatePlanDay,getPlanDay ,getPlanDays} from "../controllers/planDayController";

Router.post("/planDay/:id/createPlanDay",createPlanDay);
Router.post("/planDay/:id/updatePlanDay",updatePlanDay);
Router.get("/planDay/:id/getPlanDay",getPlanDay);
Router.get("/planDay/:id/getPlanDays",getPlanDays);

module.exports = Router;