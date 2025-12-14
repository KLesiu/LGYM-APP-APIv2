import { BodyParts } from "../enums/BodyParts"
import { UserEntity } from "../models/User";
import { DropdownItem } from "./Dropdown";

interface ExerciseForm{
    _id?:string,
    name:string,
    user?:string,
    bodyPart:BodyParts,
    description?:string,
    image?:string
}

interface ExerciseToCopy{
    _id?:string,
    name:string,
    user:UserEntity,
    bodyPart:BodyParts,
    description?:string,
    image?:string
}

interface ExerciseForPlanDay{
    series:number,
    reps:string,
    exercise:DropdownItem
}

interface ExerciseTrainingHistoryDetails{
    _id: string;
    name: string;
    bodyPart: BodyParts;
}

interface LastExerciseScores{
   exerciseId:string,
   name:string,
   seriesScores:SeriesScore[] 
}

interface LastExerciseScoresWithGym{
    exerciseId:string,
    exerciseName:string,
    seriesScores:SeriesScoreWithGym[] 
}

interface Score {
    reps: number;
    weight: number;
    unit: string;
    _id: string;
  }
  
  interface ScoreWithGym extends Score {
    gymName: string;
  }
  
  interface SeriesScore {
    series: number;
    score: Score | null;
  }
  
  interface SeriesScoreWithGym extends SeriesScore {
    score: ScoreWithGym; 
  }


  interface ExerciseHistoryDetails{
    trainings: ExerciseTrainingHistoryItem[]

  }

  interface ExerciseTrainingHistoryItem{
    _id:string,
    date:Date,
    gymName:string,
    trainingName:string,
    seriesScores: SeriesScore[]
  }

export {ExerciseForm,ExerciseTrainingHistoryDetails,ExerciseForPlanDay,LastExerciseScores,SeriesScore,LastExerciseScoresWithGym,SeriesScoreWithGym,ExerciseTrainingHistoryItem,ExerciseHistoryDetails,ExerciseToCopy}

