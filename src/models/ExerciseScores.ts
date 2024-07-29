import Schema from "./configModels"
const mongoose = require('mongoose')

const ExerciseScoresSchema = new Schema({
    exercise:{type:Schema.Types.ObjectId,ref:'Exercise',required:true},
    user:{type:Schema.Types.ObjectId,ref:'User',required:true},
    reps:{type:Number,required:true},
    weight:{type:Number,required:true},
    unit:{type:String,required:true},
    training:{type:Schema.Types.ObjectId,ref:'Training',required:true}
    
},{
    timestamps:true
})

const ExerciseScores = mongoose.model('ExerciseScores',ExerciseScoresSchema)
export default ExerciseScores
module.exports = ExerciseScores