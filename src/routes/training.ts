import Router from "./configRouter"
import { addTraining,getLastTraining } from "../controllers/trainingController"
Router.post('/:id/addTraining',addTraining)
Router.get('/:id/getLastTraining',getLastTraining)

module.exports = Router