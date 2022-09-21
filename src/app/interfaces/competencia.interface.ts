import { Competencia } from "../models/competencia.model";

export interface listarCompetencia{
    ok:boolean,
    competencias:Competencia[];
    desde:number,
    total:number,
}
export interface crudCompetencia{
    ok:boolean,
    msg:string,
    competencia:Competencia
}