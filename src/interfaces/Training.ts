import { ExerciseScoresTrainingForm } from "./ExercisesScores"
import { ExerciseForm, LastExerciseScores } from "./Exercise";
import { ExerciseTrainingHistoryDetails } from "./Exercise";
import { Message } from "../enums/Message";
import { Rank } from "./User";
interface TrainingForm{
    type:string,
    createdAt:Date,
    exercises:ExerciseScoresTrainingForm[],
    lastExercisesScores:LastExerciseScores[]
}

interface TrainingSessionScores{
    exercise: ExerciseForm;
    series: number;
    reps: number;
    weight: number;
}

interface LastTrainingInfo{
    _id:string,
    type:string,
    createdAt:Date,
    planDay:{
        name:string
    }
}
interface TrainingByDate extends LastTrainingInfo{
    exercises: {exerciseScoreId:string}[]
}

interface TrainingByDateDetails extends LastTrainingInfo{
    exercises:{
        exerciseScoreId:string,
        scoresDetails:ExerciseScoresTrainingForm[]
        exerciseDetails:ExerciseTrainingHistoryDetails
    }[]
   
}
interface EnrichedExercise {
    exerciseScoreId: string;
    scoreDetails: ExerciseScoresTrainingForm;
    exerciseDetails: ExerciseTrainingHistoryDetails;
}
interface TrainingHistoryQuery{
    startDt:Date,
    endDt:Date
}
interface TrainingSummary{
    progress:{
        bestProgress:{
            exercise:string,
            series:number,
            repsScore:number,
            weightScore:number
        },
        worseRegress:{
            exercise:string,
            series:number,
            repsScore:number,
            weightScore:number
        }
    },
    gainElo:number,
    userOldElo:number,
    profileRank:Rank,
    nextRank:Rank | null,
    msg: Message


}

interface MarkedDates  {
    date:Date | string
    dots: {color:string,selectedColor?:string}[]
}
export {TrainingForm,LastTrainingInfo,TrainingHistoryQuery,TrainingByDate,TrainingByDateDetails,TrainingSessionScores,EnrichedExercise,TrainingSummary,MarkedDates}
