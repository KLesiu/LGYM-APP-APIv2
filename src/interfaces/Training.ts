import FieldScore from "./FieldScore"
export interface AddTrainingBody{
    day:string,
    training:FieldScore[],
    createdAt:string
}
export interface TrainingHistory{
    trainingHistory: TrainingSession[]
}
export interface Training{
    training?:TrainingSession
    prevSession?:TrainingSession
}
export interface TrainingSession{
    _id: string,
    user:string,
    day:string,
    exercises: FieldScore[],
    createdAt:string,
    plan:string
}
