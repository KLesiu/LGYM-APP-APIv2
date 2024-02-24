import Schema from "./configModels"
const mongoose = require('mongoose')
const ExerciseSchema = new Schema({
    name:{type:String,maxLength:40,required:true},
    reps:{type:String,required:false},
    repCurrent:{type:Number,required:false},
    weight:{type:Number,required:false},
    series:{type:Number,required:false}
})

const Exercise = mongoose.model('Exercise',ExerciseSchema)
export default Exercise
module.exports = Exercise