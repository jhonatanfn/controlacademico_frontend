import { Persona } from "./persona.model";


export class Docente{

    constructor(
        public personaId:number,
        public numero?:number,
        public persona?:Persona,
        public estado?:boolean,
        public id?:number,
    ){}



}