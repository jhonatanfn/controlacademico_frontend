import { Evaluacion } from "../models/evaluacion.model";


export interface listarEvaluaciones{
    ok:boolean,
    evaluaciones:Evaluacion[];
    desde:number,
    total:number,
}

export interface crudEvaluacion{
    ok:boolean,
    msg:string,
    evaluacion:Evaluacion
}