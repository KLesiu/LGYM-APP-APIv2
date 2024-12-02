import Schema from "./configModels";
import mongoose,{Document} from "mongoose";

export interface EloRegistryEntity extends Document {
    user: string;
    date: Date;
    elo: number;
    training?: string;
    _id: string;
}

const EloRegistrySchema = new Schema({
    // Użytkownik, który dodał wpis
    user:{type:Schema.Types.ObjectId,ref:'User',required:true},
    // Data dodania wpisu
    date:{type:Date,required:true},
    // Wynik
    elo:{type:Number,required:true},
    // Trening w którym został dodany wpis
    training:{type:Schema.Types.ObjectId,ref:'Training',required:false}
})

const EloRegistry = mongoose.model<EloRegistryEntity>('EloRegistry',EloRegistrySchema)
export default EloRegistry  
