import Schema from "./configModels"
const mongoose = require('mongoose')
const TrainingSchema= new Schema({
    user: {type:Schema.Types.ObjectId,ref:"User",required:true},
    type:{type:String,maxLength:1,required:true},
    exercises:{type:Array,required:false},
    createdAt:{type:String,required:true},
    plan :{type:Schema.Types.ObjectId,ref:'Plan',required:false}
})

const Training = mongoose.model('Training',TrainingSchema)
export default Training
module.exports = Training