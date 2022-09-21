import { Tipodocumento } from "./tipodocumento.model";


export class Persona{

    constructor(
        public dni:string,
        public nombres:string,
        public apellidopaterno:string,
        public apellidomaterno:string,
        public sexo:number,
        public tipodocumento: Tipodocumento,
        public domicilio?:string,
        public telefono?:string,
        public nacionalidad?:string,
        public distrito?:string,
        public fechanacimiento?:string,
        public correo?:string,
        public img?:string,
        public estado?:boolean,
        public id?:number
    ){}

}