import { Subarea } from "../models/subarea.model";

export interface listarSubareas{
    ok:boolean,
    subareas:Subarea[];
    desde:number,
    total:number
}

export interface crudSubarea{
    ok:boolean,
    msg:string,
    subarea:Subarea
}