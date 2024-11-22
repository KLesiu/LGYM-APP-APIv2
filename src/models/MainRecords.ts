import { WeightUnits } from "../enums/Units";
import Schema from "./configModels";
import mongoose,{Document} from "mongoose";

export interface MainRecordsEntity extends Document {
    user: string;
    exercise: string;
    weight: number;
    date: Date;
    unit: WeightUnits;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

const MainRecordsSchema = new Schema({
    // Użytkownik, który zapisuje rekord
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // Ćwiczenie, dla którego zapisujemy rekord
    exercise:{ type: Schema.Types.ObjectId, ref: "Exercise", required: true },
    // Ciężar, z jakim wykonano rekord
    weight: { type: Number, required: true },
    // Data wykonania rekordu
    date: { type: Date, required: true },
    // Jednostka wagi
    unit: { type: String, required: true }
    
}, {
    timestamps: true
});

const MainRecords = mongoose.model<MainRecordsEntity>('MainRecords', MainRecordsSchema);
export default MainRecords;
