import { PlanDayExercise } from "../interfaces/PlanDay";
import Schema from "./configModels"
import mongoose, {  Document } from "mongoose";

export interface PlanDayEntity extends Document {
    name: string;
    plan: string;
    isDeleted: boolean;
    exercises: PlanDayExercise[];
    _id: string;
}

const PlanDaySchema = new Schema({
  // Nazwa planu dnia
    name:{type:String,required:true},
    // Plan, do którego przypisany jest dzień treningowy
    plan:{type:Schema.Types.ObjectId,ref:"Plan",required:true},
    // Czy plan dnia jest usunięty
    isDeleted:{type:Boolean,required:true},
    // Ćwiczenia w planie dnia
    exercises: [
        {
          // Ilość serii
          series: { type: Number, required: true },
          // Ilość powtórzeń
          reps: { type: String, required: true },
          // Ćwiczenie
          exercise: { type: Schema.Types.ObjectId, ref: "Exercise", required: true }
        }
      ]
})

const PlanDay = mongoose.model<PlanDayEntity>('PlanDay',PlanDaySchema)
export default PlanDay
