export interface PlanDayForm{
    _id?:string,
    name:string,
    exercises:{
        series:number,
        reps:string,
        exercise:string
    }[],
}