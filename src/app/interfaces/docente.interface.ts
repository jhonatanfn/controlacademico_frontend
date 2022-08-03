import { Docente } from "../models/docente.model";


export interface listarDocentes{
    ok:boolean,
    docentes:Docente[];
    desde:number,
    total:number,
}

export interface crudDocente{
    ok:boolean,
    msg:string,
    docente:Docente
}