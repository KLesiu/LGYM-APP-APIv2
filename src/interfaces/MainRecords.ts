import { WeightUnits } from "../enums/Units"
import { ExerciseForm } from "./Exercise"

export interface MainRecordsForm{
    _id?:string,
    weight:number,
    date: Date,
    unit:WeightUnits,
    exercise:string
}


export interface MainRecordsLast extends MainRecordsForm{
    exerciseDetails:ExerciseForm
}

