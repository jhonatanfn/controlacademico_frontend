import { Apreciacion } from "../models/apreciacion.model"

export interface listarApreciaciones{
    ok:boolean,
    apreciaciones:Apreciacion[],
    desde:number,
    total:number
}

export interface crudApreciacion{
    ok:boolean,
    msg:string,
    apreciacion:Apreciacion
}