import Schema from "./configModels"
const mongoose = require('mongoose')
const TrainingSchema= new Schema({
    user: {type:Schema.Types.ObjectId,ref:"User",required:true},
    type:{type:Schema.Types.ObjectId,ref:'PlanDay',required:true},
    exercises:{type:Array,required:false},
    createdAt:{type:Date,required:true},
})

const Training = mongoose.model('Training',TrainingSchema)
export default Training
module.exports = Training