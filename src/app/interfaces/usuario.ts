import { Usuario } from "../models/usuario.model";


export interface listarUsuarios{
    ok:boolean,
    usuarios:Usuario[];
    desde:number,
    total:number,
}

export interface crudUsuario{
    ok:boolean,
    msg:string,
    usuario:Usuario
}

export interface loginUsuario{
    ok:boolean,
    msg:string,
    usuario:Usuario
    token:string,
    menu:string[]
}