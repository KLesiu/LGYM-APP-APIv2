import Router from "./configRouter"
import { addTraining,getLastTraining, getTrainingByDate,getTrainingDates } from "../controllers/trainingController"
Router.post('/:id/addTraining',addTraining)
Router.get('/:id/getLastTraining',getLastTraining)
Router.post("/:id/getTrainingByDate",getTrainingByDate)
Router.get("/:id/getTrainingDates",getTrainingDates)

export default Router;
