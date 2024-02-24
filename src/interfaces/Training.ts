import FieldScore from "./FieldScore"
export interface addTrainingBody{
    day:string,
    training:FieldScore[],
    createdAt:string
}