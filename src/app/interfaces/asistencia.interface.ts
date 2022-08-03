import { Asistencia } from "../models/asistencia.model";

export interface listarAsistencias{
    ok:boolean,
    asistencias:Asistencia[],
    desde:number,
    total:number
}

export interface crudAsistencia{
    ok:boolean,
    msg:string,
    asistencia:Asistencia
}