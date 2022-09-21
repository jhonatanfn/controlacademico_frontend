import { Situacion } from "../models/situacion.model";

export interface listarSituaciones{
    ok:boolean,
    situaciones:Situacion[];
    desde:number,
    total:number,
}

export interface crudSituacion{
    ok:boolean,
    msg:string,
    situacion:Situacion
}