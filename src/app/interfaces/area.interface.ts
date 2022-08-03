import { Area } from "../models/area.model";

export interface listarAreas{
    ok:boolean,
    areas:Area[],
    desde:number,
    total:number
}

export interface crudArea{
    ok:boolean,
    msg:string,
    area:Area
}