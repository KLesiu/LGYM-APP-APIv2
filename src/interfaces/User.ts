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