const mainRecordsController = require("./../controllers/mainRecordsController")
import Router from "./configRouter"
Router.post("/mainRecords/:id/addNewRecords",mainRecordsController.addNewRecords)

module.exports = Router