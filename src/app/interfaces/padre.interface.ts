import { Padre } from "../models/padre.model";

export interface listarPadres{
    ok:boolean,
    padres:Padre[];
    desde:number,
    total:number,
}

export interface crudPadre{
    ok:boolean,
    msg:string,
    padre:Padre,
}