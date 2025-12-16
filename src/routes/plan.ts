import { createPlan, updatePlan,getPlanConfig ,checkIsUserHavePlan,getPlansList,setNewActivePlan} from "../controllers/planController"
import Router from "./configRouter"

Router.post('/:id/createPlan',createPlan)
Router.post('/:id/updatePlan',updatePlan)
Router.get('/:id/getPlanConfig',getPlanConfig)
Router.get("/:id/checkIsUserHavePlan",checkIsUserHavePlan)
Router.get("/:id/getPlansList",getPlansList)
Router.post("/:id/setNewActivePlan",setNewActivePlan)

export default Router;
