import FieldScore from "./FieldScore"
import User from "./../models/User"
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

export interface RankInfo{
    rank:string,
    elo:number,
    nextRank:string,
    nextRankElo:number,
    startRankElo:number
}

export interface TrainingsDates{
    dates: Date[]
}

export interface UserRanking{
    user: typeof User,
    position:number

}
