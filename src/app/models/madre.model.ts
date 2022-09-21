import { Persona } from "./persona.model";

export class Madre{
    constructor(
        public personaId:number,
        public persona?:Persona,
        public id?:number
    ){}
}