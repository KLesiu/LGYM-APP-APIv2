export interface User{
    name:string,
    email:string,
    password:string
}
export interface RequestUser{
    _id:string
}
export interface UserRecords{
    sq:number,
    dl:number,
    bp:number,
    // user id
    id:string
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
    Bp:number,
    Dl:number,
    Sq:number
}