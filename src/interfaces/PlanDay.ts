import { ExerciseForm } from "./Exercise";
export interface PlanDayForm {
  _id?: string;
  name: string;
  exercises: {
    series: number;
    reps: string;
    exercise: string;
  }[];
}

export interface PlanDayVm {
  _id: string;
  name: string;
  exercises: {
    series: number;
    reps: string;
    exercise: ExerciseForm;
  }[];
}

export interface PlanDayExercise{
  series: number;
  reps: string;
  exercise:string;
  _id:string;
}