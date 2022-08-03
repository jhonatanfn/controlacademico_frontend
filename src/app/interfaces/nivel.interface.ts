import { Nivel } from "../models/nivel.model";


export interface listarNiveles{
    ok:boolean,
    niveles:Nivel[];
    desde:number,
    total:number,
}

export interface crudNivel{
    ok:boolean,
    msg:string,
    nivel:Nivel
}