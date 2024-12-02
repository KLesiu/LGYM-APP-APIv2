import { BodyParts } from '../enums/BodyParts';
import { HeightUnits } from '../enums/Units';
import Schema from './configModels'
import mongoose, {Document} from "mongoose";

export interface MeasurementsEntity extends Document {
    user: string;
    bodyPart: BodyParts;
    unit: HeightUnits;
    value: number;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

const MeasurementsSchema = new Schema({
    // Użytkownik, który zapisuje pomiary
    user:{type:Schema.Types.ObjectId,ref:"User",required:true},
    // Część ciała, dla której zapisujemy pomiary
    bodyPart:{type:String,required:true},
    // Jednostka miary
    unit:{type:String,required:true},
    // Wartość pomiaru
    value:{type:Number,required:true},

},{
    timestamps:true
})
const Measurements = mongoose.model<MeasurementsEntity>('Measurements',MeasurementsSchema)
export default Measurements
