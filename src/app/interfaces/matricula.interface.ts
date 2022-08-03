import { Matricula } from "../models/matricula.model";


export interface listarMatriculas{
    ok:boolean,
    msg: string,
    matriculas:Matricula[];
    desde:number,
    total:number
}

export interface crudMatricula{
    ok:boolean,
    msg:string,
    matricula:Matricula,
}