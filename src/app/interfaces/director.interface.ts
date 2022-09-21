import { Director } from "../models/director.model";

export interface listarDirectores{
    ok:boolean,
    directores:Director[];
    desde:number,
    total:number,
}
export interface crudDirector{
    ok:boolean,
    msg:string,
    director:Director
}