import { getExerciseScoresChartData } from "../controllers/exercisesScoresController";
import Router from "./configRouter";

Router.post("/exerciseScores/:id/getExerciseScoresChartData",getExerciseScoresChartData)

module.exports = Router