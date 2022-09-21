import { Persona } from "./persona.model";

export class Padre{
    constructor(
        public personaId:number,
        public persona?:Persona,
        public id?:number
    ){}
}