import { addNewRecords,getMainRecordsHistory,getLastMainRecords,deleteMainRecords,updateMainRecords } from "../controllers/mainRecordsController"
import Router from "./configRouter"
Router.post("/mainRecords/:id/addNewRecords",addNewRecords)
Router.get("/mainRecords/:id/getMainRecordsHistory",getMainRecordsHistory)
Router.get("/mainRecords/:id/getLastMainRecords",getLastMainRecords)
Router.post("/mainRecords/:id/deleteMainRecords",deleteMainRecords)
Router.post("/mainRecords/:id/updateMainRecords",updateMainRecords)

module.exports = Router