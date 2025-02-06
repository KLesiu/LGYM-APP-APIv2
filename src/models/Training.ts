import Schema from "./configModels"
import mongoose, { Schema as SchemaType, Document, Model } from "mongoose";


export interface TrainingEntity extends Document {
    user: string;
    type: string;
    exercises?: {exerciseScoreId: string}[];
    createdAt: Date;
    gym:string;
    _id: string;
}

const TrainingSchema= new Schema({
    // Użytkownik, który dodał trening
    user: {type:Schema.Types.ObjectId,ref:"User",required:true},
    // Plan Dnia, do którego przypisany jest trening
    type:{type:Schema.Types.ObjectId,ref:'PlanDay',required:true},
    // Wykonane ćwiczenia Typ:{exerciseScoreId: string}[], gdzie exerciseScoreId to id modelu ExerciseScore
    exercises:{type:Array,required:false},
    // Data utworzenia
    createdAt:{type:Date,required:true},
    // Siownia na której wykonano trening
    gym:{type:Schema.Types.ObjectId,ref:'Gym',required:true}
})

const Training = mongoose.model<TrainingEntity>('Training',TrainingSchema)
export default Training
