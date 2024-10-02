import { createPlan, updatePlan,getPlanConfig ,checkIsUserHavePlan} from "../controllers/planController"
import Router from "./configRouter"

Router.post('/:id/createPlan',createPlan)
Router.post('/:id/updatePlan',updatePlan)
Router.get('/:id/getPlanConfig',getPlanConfig)
Router.get("/:id/checkIsUserHavePlan",checkIsUserHavePlan)

module.exports = Router