import { Periodo } from "../models/periodo.model";


export interface listarPeriodos{
    ok:boolean,
    periodos:Periodo[],
    desde:number,
    total:number
}

export interface crudPeriodo{
    ok:boolean,
    msg:string,
    periodo:Periodo
}