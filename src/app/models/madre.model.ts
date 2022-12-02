import { Persona } from "./persona.model";

export class Madre{
    constructor(
        public personaId:number,
        public persona?:Persona,
        public vive?:boolean,
        public valor?:string,
        public id?:number
    ){}
}