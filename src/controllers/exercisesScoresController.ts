import { Request,Response } from "express"
import {ExerciseScoresForm} from "../interfaces/ExercisesScores"
import { Message } from "../enums/Message"
import Training from "../models/Training"
import Exercise from "../models/Exercise"
import ExerciseScores from "../models/ExerciseScores"
import User from "../models/User"

const addExercisesScores = async(form:ExerciseScoresForm)=>{
    const result = await ExerciseScores.create(form)
    return {exerciseScoreId:result._id as string}
}

export {addExercisesScores}