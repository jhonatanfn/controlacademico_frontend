import { Apreciaciondetalle } from "../models/apreciaciondetalle"


export interface listarApreciaciondetalles{
    ok:boolean,
    apreciaciondetalles:Apreciaciondetalle[],
    desde:number,
    total:number
}

export interface crudApreciaciondetalle{
    ok:boolean,
    msg:string,
    apreciaciondetalle:Apreciaciondetalle
}