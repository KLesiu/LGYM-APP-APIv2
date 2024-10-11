import { BodyParts } from "../enums/BodyParts"
export interface ExerciseForm{
    _id?:string,
    name:string,
    user?:string,
    bodyPart:BodyParts,
    description:string,
    image:string
}



export interface ExerciseTrainingHistoryDetails{
    _id: string;
    name: string;
    bodyPart: BodyParts;
}

export interface LastExerciseScores{
   exerciseId:string,
   name:string,
   seriesScores:SeriesScore[] 
}

export interface SeriesScore{
   series:number,
   score:{
    createdAt:Date,
    reps:number,
    weight:number,
    unit:string,
    _id:string
   } | null
}

