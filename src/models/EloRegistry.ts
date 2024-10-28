import Schema from "./configModels";
const mongoose = require('mongoose');

const EloRegistrySchema = new Schema({
    // Użytkownik, który dodał wpis
    user:{type:Schema.Types.ObjectId,ref:'User',required:true},
    // Data dodania wpisu
    date:{type:Date,required:true},
    // Wynik
    result:{type:Number,required:true},
    // Trening w którym został dodany wpis
    training:{type:Schema.Types.ObjectId,ref:'Training',required:false}
})

const EloRegistry = mongoose.model('EloRegistry',EloRegistrySchema)
export default EloRegistry  
