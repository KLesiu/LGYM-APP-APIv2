const trainingController = require('../controllers/trainingController')
import Router from "./configRouter"
Router.post('/:id/addTraining',trainingController.addTraining)
Router.get('/:id/getTrainingHistory',trainingController.getTrainingHistory)
Router.get('/:id/getTrainingSession',trainingController.getCurrentTrainingSession)
Router.get('/:id/getPrevSessionTraining/:day',trainingController.getPreviousTrainingSession)
Router.get(`/:id/checkPrevSessionTraining/:day`,trainingController.checkPreviousTrainingSession)
Router.post('/:id/getTraining',trainingController.getTraining)
Router.get('/:id/getLastTraining',trainingController.getLastTrainingSession)
Router.get('/:id/getInfoAboutRankAndElo',trainingController.getInfoAboutRankAndElo)
Router.post("/:id/getTrainingDates",trainingController.getTrainingDates)
Router.get("/getBestTenUsersFromElo",trainingController.getBestTenUsersFromElo)

module.exports = Router