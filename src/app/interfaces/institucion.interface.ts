import { Institucion } from "../models/institucion.model";

export interface crudInstitucion{
    ok:boolean,
    msg:string,
    institucion:Institucion,
}