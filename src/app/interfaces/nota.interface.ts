import { Nota } from "../models/nota.model";

export interface listarNotas{
    ok:boolean,
    notas:Nota[];
    desde:number,
    total:number
}

export interface crudNota{
    ok:boolean,
    msg:string,
    nota:Nota,
}