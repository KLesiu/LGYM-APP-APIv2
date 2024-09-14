import { BodyParts } from "../enums/BodyParts"
export interface ExerciseForm{
    _id?:string,
    name:string,
    bodyPart:BodyParts,
    description:string,
    image:string
}

