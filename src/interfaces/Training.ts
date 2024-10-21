import FieldScore from "./FieldScore"
import { ExerciseScoresForm,ExerciseScoresTrainingForm } from "./ExercisesScores"
import { ExerciseForm, LastExerciseScores } from "./Exercise";
import { BodyParts } from "../enums/BodyParts";
import { WeightUnits } from "../enums/Units";
import { ExerciseTrainingHistoryDetails } from "./Exercise";
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
        scoreDetails:ExerciseScoresTrainingForm[]
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





export {TrainingForm,LastTrainingInfo,TrainingHistoryQuery,TrainingByDate,TrainingByDateDetails,TrainingSessionScores,EnrichedExercise}





export interface AddTrainingBody{
    day:string,
    training:FieldScore[],
    createdAt:string
}
export interface TrainingHistory{
    trainingHistory: TrainingSession[]
}
export interface Training{
    training?:TrainingSession
    prevSession?:TrainingSession
}
export interface TrainingSession{
    _id: string,
    user:string,
    day:string,
    exercises: FieldScore[],
    createdAt:string,
    plan:string
}

export interface RankInfo{
    rank:string,
    elo:number,
    nextRank:string,
    nextRankElo:number,
    startRankElo:number
}

export interface TrainingsDates{
    dates: Date[]
}

export interface UserRanking{
    user: typeof User,
    position:number

}
