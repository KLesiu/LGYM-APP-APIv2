import { BodyParts } from "../enums/BodyParts"
import { WeightUnits } from "../enums/Units"

export interface MeasurementForm{
    user:string,
    bodyPart: BodyParts,
    unit: WeightUnits,
    value:number,
    createdAt?:Date,
    updatedAt?:Date 

}


export interface MeasurementsHistoryQuery{
    bodyPart: BodyParts
}

export interface MeasurementsHistory{
    measurements: MeasurementForm[]
}
