import Router from "./configRouter"
import { addTraining } from "../controllers/trainingController"
Router.post('/:id/addTraining',addTraining)

module.exports = Router