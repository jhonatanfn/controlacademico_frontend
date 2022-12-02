import { Persona } from "./persona.model";

export class Responsable{
    constructor(
        public personaId:number,
        public persona?:Persona,
        public id?:number
    ){}
}

/*
    constructor(
        public tipo:number,
        public vive:boolean,
        public correo:string,
        public estado?:boolean,
        public id?:number
    ){}

*/