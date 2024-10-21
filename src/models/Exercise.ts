import Schema from "./configModels"
const mongoose = require('mongoose')

const ExerciseSchema = new Schema({
    name:{type:String,required:true},
    bodyPart:{type:String,required:true},
    description:{type:String,required:false},
    image:{type:String,required:false},
    user:{type:Schema.Types.ObjectId,ref:'User',required:false}
})

const Exercise = mongoose.model('Exercise',ExerciseSchema)
export default Exercise
module.exports = Exercise