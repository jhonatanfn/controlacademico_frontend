import { Apoderado } from "./apoderado.model";
import { Persona } from "./persona.model";


export class Alumno{

    constructor(
        public personaId?:number,
        public apoderadoId?:number,
        public persona?:Persona,
        public apoderado?:Apoderado,
        public id?:number
    ){}
}