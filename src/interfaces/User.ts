interface UserBaseInfo{
    _id:string,
    name:string,
    admin?:boolean,
    email:string,
    profileRank:string
    elo:number,
    createdAt:Date,
    updatedAt:Date
}
interface Rank{
    name:string,
    needElo:number
}
interface UserInfo extends UserBaseInfo{
    nextRank:Rank,
}
interface LoginUser {
    name:string,
    password:string
}
interface RegisterUser extends LoginUser{
    email:string,
    cpassword:string
}
interface UserElo{
    elo: number
}
interface UserLoginInfo{
    name:string,
    _id:string,
    email:string,
    avatar:string | undefined
}

interface UserProfileInfo{
    name:string,
    email:string,
}

export {UserInfo,UserBaseInfo,Rank,RegisterUser,LoginUser,UserElo,UserLoginInfo,UserProfileInfo}


