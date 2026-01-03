import { addMeasurement,getMeasurementDetails,getMeasurementsHistory } from "../controllers/measurementsController"
import Router from "./configRouter"
Router.post("/measurements/add",addMeasurement)
Router.get("/measurements:/:id/getMeasurementDetail",getMeasurementDetails)
Router.get("/measurements/:id/getHistory",getMeasurementsHistory)

export default Router;
