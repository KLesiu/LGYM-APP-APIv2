import Router from "./configRouter";
import { addExercise,addUserExercise,deleteExercise,updateExercise,getAllExercises,getExerciseByBodyPart, getAllGlobalExercises,getAllUserExercises,getExercise,getLastExerciseScores, getExerciseScoresFromTrainingByExercise } from "../controllers/exerciseController";
import { middlewareAuth } from "../middlewares/auth";

Router.post("/exercise/addExercise",addExercise);
Router.post("/exercise/:id/addUserExercise",addUserExercise);
Router.post("/exercise/:id/deleteExercise",deleteExercise);
Router.post("/exercise/updateExercise",updateExercise);
Router.get("/exercise/:id/getAllExercises",getAllExercises);
Router.post("/exercise/:id/getExerciseByBodyPart",getExerciseByBodyPart);
Router.get("/exercise/getAllGlobalExercises",getAllGlobalExercises);
Router.get("/exercise/:id/getAllUserExercises",getAllUserExercises);
Router.get("/exercise/:id/getExercise",getExercise);
Router.post("/exercise/:id/getLastExerciseScores",getLastExerciseScores);
Router.post("/exercise/getExerciseScoresFromTrainingByExercise",getExerciseScoresFromTrainingByExercise);


export default Router;
