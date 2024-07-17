export interface IUser{
    id:string;
    name:string;
    email:string;
    password:string;
    role_id:1 | 2;
}

export interface IGetUserQuery{
    q?:string;
    page?:number;
    size?:number;
}