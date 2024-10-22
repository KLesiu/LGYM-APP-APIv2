import Schema from "./configModels"
const mongoose = require('mongoose')
const PlanSchema = new Schema({
    // Użytkownik, który stworzył plan
    user:{type:Schema.Types.ObjectId,ref:"User",required:true},
    // Nazwa planu
    name:{type:String,required:true},
    // Ilość dni treningowych w planie TODO:(do kasacji)
    trainingDays:{type:Number,required:true}
})
const Plan = mongoose.model('Plan',PlanSchema)
export default Plan
module.exports = Plan