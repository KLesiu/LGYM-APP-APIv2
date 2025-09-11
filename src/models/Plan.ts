import Schema from "./configModels"
import mongoose, { Document } from "mongoose";


export interface PlanEntity extends Document {
    user: string;
    name: string;
    isActive: boolean;
    _id: string;
}

const PlanSchema = new Schema({
    // Użytkownik, który stworzył plan
    user:{type:Schema.Types.ObjectId,ref:"User",required:true},
    // Nazwa planu
    name:{type:String,required:true},
    /// Czy plan jest aktywny
    isActive:{type:Boolean,required:true,default:true},
 
})
const Plan = mongoose.model<PlanEntity>('Plan',PlanSchema)
export default Plan
