import { Persona } from "./persona.model";

export class Auxiliar{
    constructor(
        public personaId:number,
        public persona?:Persona,
        public numero?:number,
        public estado?:boolean,
        public id?:number,
    ){}
}