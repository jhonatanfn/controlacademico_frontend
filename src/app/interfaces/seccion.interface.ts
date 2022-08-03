import { Seccion } from "../models/seccion.model";


export interface listarSecciones{

    ok:boolean,
    secciones:Seccion[],
    desde:number,
    total:number
}

export interface crudSeccion{
    ok:boolean,
    msg:string,
    seccion:Seccion
}