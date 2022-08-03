import { Grado } from "../models/grado.model";

export interface listarGrados{
    ok: boolean,
    grados:Grado[],
    desde:number,
    total:number
}

export interface crudGrado{
    ok:boolean,
    msg:string,
    grado:Grado
}