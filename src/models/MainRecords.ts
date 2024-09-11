import Schema from "./configModels";
const mongoose = require('mongoose');
const MainRecordsSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    squat: { type: Number, required: true },
    deadLift: { type: Number, required: true },
    benchPress: { type: Number, required: true },
    date: { type: Date, required: true },
    
}, {
    timestamps: true
});

const MainRecords = mongoose.model('MainRecords', MainRecordsSchema);
export default MainRecords;
module.exports = MainRecords;