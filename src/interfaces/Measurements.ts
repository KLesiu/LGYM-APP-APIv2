
export interface MeasurementForm{
    weight:number,
    neck:number,
    chest:number,
    biceps:number,
    waist:number,
    abdomen:number,
    hips:number,
    thigh:number,
    calf:number,

}
export interface Measurement extends MeasurementForm{
    createdAt:Date,
    updatedAt:Date
}
export interface MeasurementsHistory{
    measurements: Measurement[]
}
