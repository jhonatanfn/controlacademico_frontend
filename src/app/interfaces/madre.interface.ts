import { Madre } from "../models/madre.model";

export interface listarMadres{
    ok:boolean,
    madres:Madre[];
    desde:number,
    total:number,
}

export interface crudMadre{
    ok:boolean,
    msg:string,
    madre:Madre,
}