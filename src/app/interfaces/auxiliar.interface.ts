import { Auxiliar } from "../models/auxiliar.model";

export interface listarAuxiliares{
    ok:boolean,
    auxiliares:Auxiliar[];
    desde:number,
    total:number,
}

export interface crudAuxiliar{
    ok:boolean,
    msg:string,
    auxiliar:Auxiliar
}