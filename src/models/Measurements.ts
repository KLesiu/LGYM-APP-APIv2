import Schema from './configModels'
const mongoose = require('mongoose')
const MeasurementsSchema = new Schema({
    user:{type:Schema.Types.ObjectId,ref:"User",required:true},
    weight:{type:Number,required:false},
    neck:{type:Number,required:false},
    chest:{type:Number,required:false},
    biceps:{type:Number,required:false},
    waist:{type:Number,required:false},
    abdomen:{type:Number,required:false},
    hips:{type:Number,required:false},
    thigh:{type:Number,required:false},
    calf:{type:Number,required:false}

},{
    timestamps:true
})
const Measurements = mongoose.model('Measurements',MeasurementsSchema)
export default Measurements
module.exports = Measurements