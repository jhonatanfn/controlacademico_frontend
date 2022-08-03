import { Aula } from "../models/aula.model";


export interface listarAulas{
    ok:boolean,
    aulas:Aula[],
    desde:number,
    total:number
}

export interface crudAula{
    ok:boolean,
    msg:string,
    aula:Aula
}