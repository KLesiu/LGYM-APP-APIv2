import Schema from "./configModels"
const mongoose = require('mongoose')
const PlanDaySchema = new Schema({
    name:{type:String,required:true},
    plan:{type:Schema.Types.ObjectId,ref:"Plan",required:true},
    exercises: [
        {
          series: { type: Number, required: true },
          reps: { type: String, required: true },
          exercise: { type: Schema.Types.ObjectId, ref: "Exercise", required: true }
        }
      ]
})

const PlanDay = mongoose.model('PlanDay',PlanDaySchema)
export default PlanDay
module.exports = PlanDay