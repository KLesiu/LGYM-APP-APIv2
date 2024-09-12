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
    maxElo:number
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