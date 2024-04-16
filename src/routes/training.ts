const trainingController = require('../controllers/trainingController')
import Router from "./configRouter"
Router.post('/:id/addTraining',trainingController.addTraining)
Router.get('/:id/getTrainingHistory',trainingController.getTrainingHistory)
Router.get('/:id/getTrainingSession',trainingController.getCurrentTrainingSession)
Router.get('/:id/getPrevSessionTraining/:day',trainingController.getPreviousTrainingSession)
Router.get(`/:id/checkPrevSessionTraining/:day`,trainingController.checkPreviousTrainingSession)
Router.post('/:id/getTraining',trainingController.getTraining)

module.exports = Router