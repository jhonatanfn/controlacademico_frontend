import { Ciclo } from "../models/ciclo.model";


export interface listarCiclos{
    ok:boolean,
    ciclos:Ciclo[];
    desde:number,
    total:number,
}

export interface crudCiclo{
    ok:boolean,
    msg:string,
    ciclo:Ciclo
}