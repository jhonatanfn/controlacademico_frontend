import { Persona } from "../models/persona.model";


export interface listarPersona{
    ok:boolean,
    personas:Persona[],
    desde:number,
    total:number
}
export interface crudPersona{
    ok:boolean,
    msg:string,
    persona:Persona
}