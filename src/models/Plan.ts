import Schema from "./configModels"
import mongoose, { Document } from "mongoose";


export interface PlanEntity extends Document {
    user: string;
    name: string;
    trainingDays: number;
    _id: string;
}

const PlanSchema = new Schema({
    // Użytkownik, który stworzył plan
    user:{type:Schema.Types.ObjectId,ref:"User",required:true},
    // Nazwa planu
    name:{type:String,required:true},
    // Ilość dni treningowych w planie TODO:(do kasacji)
    trainingDays:{type:Number,required:true}
})
const Plan = mongoose.model<PlanEntity>('Plan',PlanSchema)
export default Plan
