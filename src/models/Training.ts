import Schema from "./configModels"
const mongoose = require('mongoose')
const TrainingSchema= new Schema({
    user: {type:Schema.Types.ObjectId,ref:"User",required:true},
    type:{type:Schema.Types.ObjectId,ref:'PlanDay',required:true},
    exercises:{type:Array,required:true},
    createdAt:{type:Date,required:true},
    plan :{type:Schema.Types.ObjectId,ref:'Plan',required:false}
})

const Training = mongoose.model('Training',TrainingSchema)
export default Training
module.exports = Training