import Schema from './configModels'
const mongoose = require('mongoose')
const MeasurementsSchema = new Schema({
    user:{type:Schema.Types.ObjectId,ref:"User",required:true},
    bodyPart:{type:String,required:true},
    unit:{type:String,required:true},

},{
    timestamps:true
})
const Measurements = mongoose.model('Measurements',MeasurementsSchema)
export default Measurements
module.exports = Measurements