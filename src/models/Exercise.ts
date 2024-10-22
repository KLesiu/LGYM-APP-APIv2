import Schema from "./configModels"
const mongoose = require('mongoose')

const ExerciseSchema = new Schema({
    //Nazwa ćwiczenia
    name:{type:String,required:true},
    // Partia, na którą najbardziej działa ćwiczenie 
    bodyPart:{type:String,required:true},
    // Opis ćwiczenia
    description:{type:String,required:false},
    // Zdjęcie ćwiczenia
    image:{type:String,required:false},
    // Użytkownik, który dodał ćwiczenie. jeśli brak pola user to oznacza, że jest to ćwiczenie globalne widoczne dla wszystkich użytkowników jeśli nie to jest to ćwiczenie prywatne dla użytkownika, który je dodał
    user:{type:Schema.Types.ObjectId,ref:'User',required:false}
})

const Exercise = mongoose.model('Exercise',ExerciseSchema)
export default Exercise
module.exports = Exercise