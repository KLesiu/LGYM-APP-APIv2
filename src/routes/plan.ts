import { createPlan, updatePlan,getPlanConfig ,checkIsUserHavePlan,getPlansList,setNewActivePlan,copyPlan, generateShareCode} from "../controllers/planController"
import { middlewareAuth } from "../middlewares/auth"
import Router from "./configRouter"

Router.post('/:id/createPlan',createPlan)
Router.post('/:id/updatePlan',updatePlan)
Router.get('/:id/getPlanConfig',getPlanConfig)
Router.get("/:id/checkIsUserHavePlan",checkIsUserHavePlan)
Router.get("/:id/getPlansList",getPlansList)
Router.post("/:id/setNewActivePlan",setNewActivePlan)
Router.post("/copyPlan",middlewareAuth,copyPlan)
Router.post("/generateShareCode",middlewareAuth,generateShareCode)

module.exports = Router