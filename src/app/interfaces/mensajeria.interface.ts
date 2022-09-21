import { Mensajeria } from "../models/mensajeria.model";

export interface listarMensajerias{
    ok:boolean,
    mensajerias:Mensajeria[];
    desde:number,
    total:number,
}
export interface crudMensajeria{
    ok:boolean,
    msg:string,
    mensajeria:Mensajeria
}