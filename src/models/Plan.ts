import Schema from "./configModels"
const mongoose = require('mongoose')
const PlanSchema = new Schema({
    user:{type:Schema.Types.ObjectId,ref:"User",required:true},
    name:{type:String,required:true},
    trainingDays:{type:Number,required:true}
})
const Plan = mongoose.model('Plan',PlanSchema)
export default Plan
module.exports = Plan