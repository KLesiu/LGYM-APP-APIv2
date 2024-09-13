const trainingController = require('../controllers/trainingController')
import Router from "./configRouter"
import { addTraining } from "../controllers/trainingController"
Router.post('/:id/addTraining',addTraining)
// Router.get('/:id/getInfoAboutRankAndElo',trainingController.getInfoAboutRankAndElo)
// Router.post("/:id/getTrainingDates",trainingController.getTrainingDates)
// Router.get("/getBestTenUsersFromElo",trainingController.getBestTenUsersFromElo)

module.exports = Router