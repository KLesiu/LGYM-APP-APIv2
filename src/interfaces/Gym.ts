interface GymForm{
    name: string;
    address?: string;
    _id?: string;
}

interface GymChoiceInfo extends GymForm{
    lastTrainingInfo:LastTrainingGymInfo
}


interface LastTrainingGymInfo{
    _id:string,
    createdAt:Date,
    type:LastTrainingGymPlanDayInfo,
    name:string,
}

interface LastTrainingGymPlanDayInfo{
    _id:string,
    name:string
}

export {GymForm,GymChoiceInfo,LastTrainingGymInfo}