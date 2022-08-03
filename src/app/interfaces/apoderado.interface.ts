import { Apoderado } from "../models/apoderado.model";

export interface listarApoderados{
    ok:boolean,
    apoderados:Apoderado[];
    desde:number,
    total:number,
}

export interface crudApoderado{
    ok:boolean,
    msg:string,
    apoderado:Apoderado
}