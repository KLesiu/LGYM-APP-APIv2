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

interface PossibleRecordForExercise{
    weight: number,
    reps: number,
    unit: WeightUnits,
    date: Date
}

export {MainRecordsForm,MainRecordsLast,PossibleRecordForExercise}

