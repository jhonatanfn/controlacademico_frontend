import { Tipodocumento } from "./tipodocumento.model";


export class Persona{

    constructor(
        public numero:string,
        public nombres:string,
        public apellidopaterno:string,
        public apellidomaterno:string,
        public tipodocumento: Tipodocumento,
        public direccion?:string,
        public telefono?:string,
        public img?:string,
        public id?:number
    ){}

}