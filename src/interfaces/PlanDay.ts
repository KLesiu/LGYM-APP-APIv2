import { ExerciseForm } from "./Exercise";
interface PlanDayForm {
  _id?: string;
  name: string;
  exercises: {
    series: number;
    reps: string;
    exercise: string;
  }[];
}

interface PlanDayVm {
  _id: string;
  name: string;
  exercises: {
    series: number;
    reps: string;
    exercise: ExerciseForm;
  }[];
}

interface PlanDayExercise{
  series: number;
  reps: string;
  exercise:string;
  _id:string;
}


export {PlanDayExercise, PlanDayForm, PlanDayVm};