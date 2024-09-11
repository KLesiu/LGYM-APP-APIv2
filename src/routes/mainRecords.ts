const mainRecordsController = require("./../controllers/mainRecordsController")
import Router from "./configRouter"
Router.post("/mainRecords/:id/addNewRecords",mainRecordsController.addNewRecords)
Router.get("/mainRecords/:id/getMainRecordsHistory",mainRecordsController.getMainRecordsHistory)
Router.get("/mainRecords/:id/getLastMainRecords",mainRecordsController.getLastMainRecords)
Router.post("/mainRecords/:id/deleteMainRecords",mainRecordsController.deleteMainRecords)
Router.post("/mainRecords/:id/updateMainRecords",mainRecordsController.updateMainRecords)

module.exports = Router