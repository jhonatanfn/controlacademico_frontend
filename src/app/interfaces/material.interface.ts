import { Material } from "../models/material.model";


export interface listarMateriales{
    ok:boolean,
    materiales:Material[],
    desde:number,
    total:number
}

export interface crudMaterial{
    ok:boolean,
    msg:string,
    material:Material
}