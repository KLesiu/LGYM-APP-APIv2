import Schema from "./configModels";
const mongoose = require('mongoose');
const MainRecordsSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    exercise:{ type: Schema.Types.ObjectId, ref: "Exercise", required: true },
    weight: { type: Number, required: true },
    date: { type: Date, required: true },
    unit: { type: String, required: true }
    
}, {
    timestamps: true
});

const MainRecords = mongoose.model('MainRecords', MainRecordsSchema);
export default MainRecords;
module.exports = MainRecords;