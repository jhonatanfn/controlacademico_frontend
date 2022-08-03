import { Rango } from "../models/rango.model";

export interface listarRangos{
    ok:boolean,
    rangos:Rango[];
    desde:number,
    total:number,
}
export interface crudRango{
    ok:boolean,
    msg:string,
    rango:Rango
}