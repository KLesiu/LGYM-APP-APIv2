import { WeightUnits } from "../enums/Units";
import Schema from "./configModels"
import mongoose, {Document} from "mongoose";

export interface ExerciseScoresEntity extends Document {
    exercise: string;
    user: string;
    reps: number;
    series: number;
    weight: number;
    unit: WeightUnits;
    training: string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

const ExerciseScoresSchema = new Schema({
    // Ćwiczenie, dla którego zapisujemy wynik
    exercise:{type:Schema.Types.ObjectId,ref:'Exercise',required:true},
    // Użytkownik, który zapisuje wynik
    user:{type:Schema.Types.ObjectId,ref:'User',required:true},
    // Powtórzenia wykonane w danej serii
    reps:{type:Number,required:true},
    // Numer serii
    series:{type:Number,required:true},
    // Ciężar, z jakim wykonano serie
    weight:{type:Number,required:true},
    // Jednostka wagi
    unit:{type:String,required:true},
    // Trening, w którym wykonano ćwiczenie
    training:{type:Schema.Types.ObjectId,ref:'Training',required:true}
    
},{
    timestamps:true
})

const ExerciseScores = mongoose.model<ExerciseScoresEntity>('ExerciseScores',ExerciseScoresSchema)
export default ExerciseScores
