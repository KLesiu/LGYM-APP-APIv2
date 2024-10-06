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


