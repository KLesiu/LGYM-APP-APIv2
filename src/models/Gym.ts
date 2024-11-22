import Schema from "./configModels";
import mongoose from "mongoose";

export interface GymEntity extends Document {
    name: string;
    user: string;
    address: string;
    _id: string;
}

const GymSchema = new Schema({
    // Nazwa siłowni
    name: { type: String, required: true },
    // Użytkownik, który dodał siłownię
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // Adres siłowni
    address: { type: Schema.Types.ObjectId,ref:'Address', required: true },
})

const Gym = mongoose.model<GymEntity>("Gym", GymSchema);
export default Gym;