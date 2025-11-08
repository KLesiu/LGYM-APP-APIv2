import { addNewRecords,getMainRecordsHistory,getLastMainRecords,deleteMainRecords,updateMainRecords, getRecordOrPossibleRecordInExercise } from "../controllers/mainRecordsController"
import { middlewareAuth } from "../middlewares/auth"
import Router from "./configRouter"
Router.post("/mainRecords/:id/addNewRecord",addNewRecords)
Router.get("/mainRecords/:id/getMainRecordsHistory",getMainRecordsHistory)
Router.get("/mainRecords/:id/getLastMainRecords",getLastMainRecords)
Router.get("/mainRecords/:id/deleteMainRecord",deleteMainRecords)
Router.post("/mainRecords/:id/updateMainRecords",updateMainRecords)
Router.post("/mainRecords/getRecordOrPossibleRecordInExercise",middlewareAuth,getRecordOrPossibleRecordInExercise)

module.exports = Router