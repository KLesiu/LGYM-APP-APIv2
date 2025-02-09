import { getBpDlSqChartData } from "../controllers/exercisesScoresController";
import Router from "./configRouter";

Router.get("/exerciseScores/:id/getBpDlSqChartData",getBpDlSqChartData)

module.exports = Router