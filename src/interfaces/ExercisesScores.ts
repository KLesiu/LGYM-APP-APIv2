import { WeightUnits } from "../enums/Units";
import { PlanDayExercise, PlanDayExercisesFormVm } from "./PlanDay";

interface ExerciseScoresTrainingForm{
    _id?: string;
    weight: number;
    unit:WeightUnits;
    reps: number;
    exercise: string;
    series: number;
}

interface ExerciseScoresForm extends ExerciseScoresTrainingForm{
    _id?: string;
    user: string;
    training: string;
    date:Date
}



interface ExerciseScoresChartData{
    _id: string;
    value: number;
    date: string;
    exerciseName: string;
    exerciseId: string;
}


interface LastExerciseScoresQuery extends PlanDayExercise{
    gym?:string;
}

export {ExerciseScoresTrainingForm,ExerciseScoresForm,ExerciseScoresChartData,LastExerciseScoresQuery}