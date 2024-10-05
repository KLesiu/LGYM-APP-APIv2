interface UserBaseInfo{
    _id:string,
    name:string,
    admin:boolean,
    email:string,
    profileRank:string
    elo:number,
    createdAt:Date,
    updatedAt:Date
    plan:string
}
interface UserInfo extends UserBaseInfo{
    nextRank:{
        name:string,
        needElo:number
    },
}

export {UserInfo,UserBaseInfo}




export interface User{
    name:string,
    email:string,
    password:string
}
export interface RequestUser{
    _id:string
}
export interface Rank{
    name:string,
    needElo:number
}
export interface UserElo{
    elo: number
}
export interface UserLoginInfo{
    name:string,
    _id:string,
    email:string,
    avatar:string
}