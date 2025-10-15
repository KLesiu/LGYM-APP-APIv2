import { ExerciseScoresTrainingForm } from "./ExercisesScores"
import { ExerciseForm, LastExerciseScores, LastExerciseScoresWithGym } from "./Exercise";
import { ExerciseTrainingHistoryDetails } from "./Exercise";
import { Message } from "../enums/Message";
import { Rank } from "./User";
interface TrainingBase{
    type:string,
    createdAt:Date,
    exercises:ExerciseScoresTrainingForm[],
}
interface TrainingForm extends TrainingBase{
    gym:string
}

interface TrainingSessionScores{
    exercise: ExerciseForm;
    series: number;
    reps: string;
    weight: string;
}

interface LastTrainingInfo{
    _id:string,
    type:string,
    createdAt:Date,
    planDay:{
        name:string
    },
    gym:string
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

interface SeriesComparison {
  series: number;
  currentResult: {
    reps: number;
    weight: number;
    unit: string;
  };
  previousResult: {
    reps: number;
    weight: number;
    unit: string;
  } | null;
}

interface GroupedExerciseComparison {
  exerciseId: string;
  exerciseName: string;
  seriesComparisons: SeriesComparison[];
}

interface TrainingSummary {
  comparison: GroupedExerciseComparison[];
  gainElo: number;
  userOldElo: number;
  profileRank: Rank;
  nextRank: Rank | null;
  msg: Message;
}

interface MarkedDates  {
    date:Date | string
    dots: {color:string,selectedColor?:string}[]
}
export {TrainingForm,LastTrainingInfo,TrainingHistoryQuery,TrainingByDate,TrainingByDateDetails,TrainingSessionScores,EnrichedExercise,TrainingSummary,MarkedDates,TrainingBase,SeriesComparison,GroupedExerciseComparison}
