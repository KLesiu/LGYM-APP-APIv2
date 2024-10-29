import Schema from "./configModels"
const mongoose = require('mongoose')

const ExerciseScoresSchema = new Schema({
    // Ćwiczenie, dla którego zapisujemy wynik
    exercise:{type:Schema.Types.ObjectId,ref:'Exercise',required:true},
    // Użytkownik, który zapisuje wynik
    user:{type:Schema.Types.ObjectId,ref:'User',required:true},
    // Powtórzenia wykonane w danej serii
    reps:{type:Number,required:true},
    // Numer serii
    series:{type:Number,required:true},
    // Ciężar, z jakim wykonano serie
    weight:{type:Number,required:true},
    // Jednostka wagi
    unit:{type:String,required:true},
    // Trening, w którym wykonano ćwiczenie
    training:{type:Schema.Types.ObjectId,ref:'Training',required:true}
    
},{
    timestamps:true
})

const ExerciseScores = mongoose.model('ExerciseScores',ExerciseScoresSchema)
export default ExerciseScores
module.exports = ExerciseScores