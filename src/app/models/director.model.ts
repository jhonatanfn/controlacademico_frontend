import { Persona } from "./persona.model";

export class Director{
    constructor(
        public personaId:number,
        public observacion?: string,
        public vigente?: number,
        public persona?:Persona,
        public estado?:boolean,
        public id?:number,
    ){}
}