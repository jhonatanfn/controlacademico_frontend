import { Persona } from "./persona.model";


export class Apoderado{

    constructor(
        public personaId?:number,
        public persona?:Persona,
        public id?:number
    ){}
}