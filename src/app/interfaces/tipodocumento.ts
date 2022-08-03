import { Tipodocumento } from "../models/tipodocumento.model";


export interface listarTipoDocumento{
    ok:boolean,
    tipodocumentos:Tipodocumento[],
    desde:number,
    total:number
}