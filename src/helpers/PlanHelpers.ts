import { Message } from "../enums/Message"
import {  Plan as PlanInterface } from "../interfaces/Plan"
import ResponseMessage from "../interfaces/ResponseMessage"
import Plan  from "../models/Plan"
const updatePlan=async(plan:typeof Plan,daysCount:number,days:{exercises:PlanInterface[]}[]):Promise<ResponseMessage>=>{
    if(daysCount === 1){
        await plan.updateOne({planA:days[0].exercises})
        return {msg:Message.Updated}
    }
    else if(daysCount === 2){
        await plan.updateOne({planA:days[0].exercises,planB:days[1].exercises})
        return {msg:Message.Updated}
    }
    else if(daysCount === 3){
        await plan.updateOne({planA:days[0].exercises,planB:days[1].exercises,planC:days[2].exercises})
        return {msg:Message.Updated}
    }
    else if(daysCount === 4){
        await plan.updateOne({planA:days[0].exercises,planB:days[1].exercises,planC:days[2].exercises,planD:days[3].exercises})
        return {msg:Message.Updated}
    }
    else if(daysCount === 5){
        await plan.updateOne({planA:days[0].exercises,planB:days[1].exercises,planC:days[2].exercises,planD:days[3].exercises,planE:days[4].exercises})
        return {msg:Message.Updated}
    }
    else if(daysCount === 6){
        await plan.updateOne({planA:days[0].exercises,planB:days[1].exercises,planC:days[2].exercises,planD:days[3].exercises,planE:days[4].exercises,planF:days[5].exercises})
        return {msg:Message.Updated}
    }
    else if(daysCount === 7){
        await plan.updateOne({planA:days[0].exercises,planB:days[1].exercises,planC:days[2].exercises,planD:days[3].exercises,planE:days[4].exercises,planF:days[5].exercises,planG:days[6].exercises})
        return {msg:Message.Updated}
    }
    else{
        return {msg:Message.TryAgain}
    }
}
export  {updatePlan}