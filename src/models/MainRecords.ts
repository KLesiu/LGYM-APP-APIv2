import Schema from "./configModels";
const mongoose = require('mongoose');
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

const MainRecords = mongoose.model('MainRecords', MainRecordsSchema);
export default MainRecords;
module.exports = MainRecords;