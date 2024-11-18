import { WeightUnits } from "../enums/Units"
import { ExerciseForm } from "./Exercise"

interface MainRecordsForm{
    _id?:string,
    weight:number,
    date: Date,
    unit:WeightUnits,
    exercise:string
}


interface MainRecordsLast extends MainRecordsForm{
    exerciseDetails:ExerciseForm
}

export {MainRecordsForm,MainRecordsLast}

