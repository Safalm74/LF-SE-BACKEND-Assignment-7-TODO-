import { func } from "joi";
import * as RoleModel from "../models/role";

export async function getPermissionForRole(role_id:string){
    return RoleModel.RoleModel.getPermissionForRole(role_id);
}