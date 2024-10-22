import Schema from './configModels'
const mongoose = require('mongoose')
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
const Measurements = mongoose.model('Measurements',MeasurementsSchema)
export default Measurements
module.exports = Measurements