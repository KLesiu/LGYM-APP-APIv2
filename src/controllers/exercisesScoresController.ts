import {ExerciseScoresForm} from "../interfaces/ExercisesScores"
import ExerciseScores from "../models/ExerciseScores"

const addExercisesScores = async(form:ExerciseScoresForm)=>{
    const result = await ExerciseScores.create(form)
    return {exerciseScoreId:result._id as string}
}

const updateExercisesScores = async(form:ExerciseScoresForm)=>{
    const result = await ExerciseScores.findByIdAndUpdate(form._id,form)
    if(!result) return {exerciseScoreId:""}
    return {exerciseScoreId:result._id as string}
}

export {addExercisesScores,updateExercisesScores}