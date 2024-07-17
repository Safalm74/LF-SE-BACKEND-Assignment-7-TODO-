import { Request as expressRequest } from "express";
import { IUser } from "./user";

export interface Request extends expressRequest  {
    user?:Omit<IUser,"password"| "role">;
}

export interface IRefreshToken{
    user_id:string;
    token:string;
}