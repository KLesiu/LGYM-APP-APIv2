import Router from "./configRouter";
import { addExercise,addUserExercise,deleteExercise,updateExercise,getAllExercises,getExerciseByBodyPart } from "../controllers/exerciseController";

Router.post("/exercise/addExercise",addExercise);
Router.post("/exercise/:id/addUserExercise",addUserExercise);
Router.delete("/exercise/deleteExercise",deleteExercise);
Router.post("/exercise/updateExercise",updateExercise);
Router.get("/exercise/:id/getAllExercises",getAllExercises);
Router.get("/exercise/:id/getExerciseByBodyPart",getExerciseByBodyPart);

module.exports = Router;