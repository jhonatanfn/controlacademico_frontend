import { Responsable } from "../models/responsable.model";

export interface listarResponsables{
    ok:boolean,
    responsables:Responsable[];
    desde:number,
    total:number,
}

export interface crudResponsable{
    ok:boolean,
    msg:string,
    responsable:Responsable,
}