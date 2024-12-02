import Params from "../interfaces/Params";
import ResponseMessage from "../interfaces/ResponseMessage";
import { PlanDayForm, PlanDayVm,PlanDayExercise} from "../interfaces/PlanDay";
import { Request, Response } from "express";
import Plan from "../models/Plan";
import { Message } from "../enums/Message";
import PlanDay, { PlanDayEntity } from "../models/PlanDay";
import User from "../models/User";
import Exercise from "../models/Exercise";
import { ExerciseForm } from "../interfaces/Exercise";


const createPlanDay = async(req:Request<Params, {}, PlanDayForm>, res:Response<ResponseMessage>) => {
    const id = req.params.id;
    const findPlan = await Plan.findById(id);   
    if(!findPlan || !Object.keys(findPlan).length) return res.status(404).send({msg: Message.DidntFind});
    const name = req.body.name;
    const exercises = req.body.exercises;
    if(!name || !exercises || !exercises.length) return res.status(400).send({msg: Message.FieldRequired});
    await PlanDay.create({
        plan: findPlan,
        name: name,
        exercises: exercises,
        isDeleted:false
    })
    return res.status(200).send({msg: Message.Created});
}

const updatePlanDay = async(req:Request<Params, {}, PlanDayForm>, res:Response<ResponseMessage>) => {
    const name = req.body.name;
    const exercises = req.body.exercises;
    if(!name || !exercises || !exercises.length) return res.status(400).send({msg: Message.FieldRequired});
    const id = req.body._id;
    if(!id) return res.status(400).send({msg: Message.DidntFind});
    const findPlanDay = await PlanDay.findById(id);
    if(!findPlanDay || !Object.keys(findPlanDay).length) return res.status(404).send({msg: Message.DidntFind});
    await findPlanDay.updateOne({name: name, exercises: exercises});
    return res.status(200).send({msg: Message.Updated});
}

const getPlanDay = async(req:Request<Params>, res:Response<PlanDayForm | ResponseMessage>) => {
    const id = req.params.id;
    const findPlanDay = await PlanDay.findById(id);
    if(!findPlanDay || !Object.keys(findPlanDay).length) return res.status(404).send({msg: Message.DidntFind});
    const exercises = await Promise.all(findPlanDay.exercises.map(async (exercise:PlanDayExercise) => { 
        const findExercise = await Exercise.findById(exercise.exercise);
        return {
            series:exercise.series,
            reps:exercise.reps,
            exercise: findExercise 
        }
    }))
    
    const planDay = {
        _id: findPlanDay._id,
        name: findPlanDay.name,
        exercises: exercises
    }
    return res.status(200).send(planDay);
}

const getPlanDays = async(req: Request<Params>, res: Response<PlanDayVm[] | ResponseMessage>) => {
    try {
        const id = req.params.id;
        
        // Znalezienie planu
        const findPlan = await Plan.findById(id);
        if (!findPlan || !Object.keys(findPlan).length) {
            return res.status(404).send({ msg: Message.DidntFind });
        }

        // Znalezienie dni planu
        const findPlanDays = await PlanDay.find({ plan: findPlan,isDeleted:false });
        if (!findPlanDays || !findPlanDays.length) {
            return res.status(404).send({ msg: Message.DidntFind });
        }

        // Mapowanie przez dni planu
        const planDays = await Promise.all(findPlanDays.map(async (planDay: PlanDayEntity) => {
            // Mapowanie przez ćwiczenia
            const exercises = await Promise.all(planDay.exercises.map(async (exercise) => {
                const findExercise = await Exercise.findById(exercise.exercise);
                // Zwrot ćwiczenia po znalezieniu
                return {
                    series: exercise.series,
                    reps: exercise.reps,
                    exercise: findExercise!,  // Tutaj masz cały obiekt ćwiczenia
                };
            }));

            // Zwrot pojedynczego dnia planu z pełnymi danymi o ćwiczeniach
            return {
                _id: planDay._id,
                name: planDay.name,
                exercises: exercises,
            };
        }));

        // Zwrot poprawnych danych z planem dni
        return res.status(200).send(planDays );
    } catch (error) {
        console.error(error);
        return res.status(500).send({ msg: 'Server error' });
    }
};

const getPlanDaysTypes = async(req: Request<Params>, res: Response<{_id:string,name:string}[] | ResponseMessage>) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if(!user || !Object.keys(user).length) return res.status(404).send({msg: Message.DidntFind});   
    const plan = await Plan.find({user: user});
    if(!plan || !plan.length) return res.status(404).send({msg: Message.DidntFind});
    const planDaysTypes = await PlanDay.find({ plan: plan,isDeleted:false}, '_id name');
    return res.status(200).send(planDaysTypes);
}

const deletePlanDay = async(req: Request<Params>, res: Response<ResponseMessage>) => {
    const id = req.params.id;
    const findPlanDay = await PlanDay.findById(id);
    if(!findPlanDay || !Object.keys(findPlanDay).length) return res.status(404).send({msg: Message.DidntFind});
    await findPlanDay.updateOne({isDeleted: true});
    return res.status(200).send({msg: Message.Deleted});
}




export{createPlanDay, updatePlanDay, getPlanDay,getPlanDays,getPlanDaysTypes,deletePlanDay}
