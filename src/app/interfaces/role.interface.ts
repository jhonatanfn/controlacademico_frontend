import { Role } from "../models/role.model";

export interface listarRoles{
    ok:boolean,
    roles: Role[];
}

export interface crudRole{
    ok:boolean,
    msg:string,
    role:Role
}

