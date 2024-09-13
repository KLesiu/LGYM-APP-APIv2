import { addMeasurements,getLastMeasurements,getMeasurementsHistory } from "../controllers/measurementsController"
import Router from "./configRouter"
Router.post("/measurements/:id/addNew",addMeasurements)
Router.get("/measurements:/:id/getHistory",getMeasurementsHistory)
Router.get("/measurements/:id/getLast",getLastMeasurements)

module.exports = Router