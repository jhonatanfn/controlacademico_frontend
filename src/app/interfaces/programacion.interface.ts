import { Programacion } from "../models/programacion.model";


export interface listarProgramacion{
    ok:boolean,
    programaciones:Programacion[],
    desde:number,
    total:number
}

export interface crudProgramacion{
    ok:boolean,
    msg:string,
    programacion:Programacion
}