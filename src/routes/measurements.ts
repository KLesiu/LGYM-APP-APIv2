const measurementsController = require("./../controllers/measurementsController")
import Router from "./configRouter"
Router.post("/measurements/:id/addNew",measurementsController.addMeasurements)
Router.get("/measurements:/:id/getHistory",measurementsController.getMeasurementsHistory)
Router.get("/measurements/:id/getLast",measurementsController.getLastMeasurements)

module.exports = Router