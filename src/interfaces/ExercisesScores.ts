import { WeightUnits } from "../enums/Units";

export interface ExerciseScoresTrainingForm{
    weight: number;
    unit:WeightUnits;
    reps: number;
    exercise: string;
    series: number;
}

export interface ExerciseScoresForm extends ExerciseScoresTrainingForm{
    _id?: string;
    user: string;
    training: string;
    date:Date
}