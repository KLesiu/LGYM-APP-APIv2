import Schema from "./configModels"
const mongoose = require('mongoose')
const PlanSchema = new Schema({
    user:{type:Schema.Types.ObjectId,ref:"User",required:true},
    name:{type:String,required:true},
    planA:{type:Array,required:false},
    planB:{type:Array,required:false},
    planC:{type:Array,required:false},
    planD:{type:Array,required:false},
    planE:{type:Array,required:false},
    planF:{type:Array,required:false},
    planG:{type:Array,required:false},
    trainingDays:{type:Number,required:true}


})
const Plan = mongoose.model('Plan',PlanSchema)
export default Plan
module.exports = Plan