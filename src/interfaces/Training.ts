import { ExerciseScoresTrainingForm } from "./ExercisesScores"
import { ExerciseForm, LastExerciseScores } from "./Exercise";
import { ExerciseTrainingHistoryDetails } from "./Exercise";
import { Message } from "../enums/Message";
import { Rank } from "./User";
interface TrainingBase{
    type:string,
    createdAt:Date,
    exercises:ExerciseScoresTrainingForm[],
}
interface TrainingForm extends TrainingBase{
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
    exercises: EnrichedExercise[]
   
}
interface EnrichedExercise {
    exerciseScoreId: string;
    scoresDetails: ExerciseScoresTrainingForm[];
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
export {TrainingForm,LastTrainingInfo,TrainingHistoryQuery,TrainingByDate,TrainingByDateDetails,TrainingSessionScores,EnrichedExercise,TrainingSummary,MarkedDates,TrainingBase}
