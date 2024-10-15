import Router from "./configRouter"
import { addTraining,getLastTraining, getTrainingByDate, getTrainingHistory,getTrainingDates } from "../controllers/trainingController"
Router.post('/:id/addTraining',addTraining)
Router.get('/:id/getLastTraining',getLastTraining)
Router.post("/:id/getTrainingHistory",getTrainingHistory)
Router.post("/:id/getTrainingByDate",getTrainingByDate)
Router.get("/:id/getTrainingDates",getTrainingDates)

module.exports = Router