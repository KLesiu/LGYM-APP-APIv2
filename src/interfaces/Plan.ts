
export interface PlanSession{
    _id?:string,
    user?:string,
    name?:string,
    planA:Plan[],
    planB:Plan[],
    planC:Plan[],
    planD:Plan[],
    planE:Plan[],
    planF:Plan[],
    planG:Plan[],
    days?:number
}
export interface Plan{
    name:string,
    reps:string,
    series:number
}
export interface DaysOfPlan{
    days:{exercises:Plan[]}[]
}
export interface SharedPlan{
    name:string,
    days:{exercises:DaysOfPlan[]}[]
    trainingDays:number,
}