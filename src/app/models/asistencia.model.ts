import { Matricula } from "./matricula.model";
import { Matriculadetalle } from "./matriculadetalle";
import { Situacion } from "./situacion.model";

export class Asistencia{
    constructor(

        public matriculadetalleId?:number,
        public situacionId?:number, 
        public fecha?:string,
        public hora?:string,
        public situacion?:Situacion,
        public matriculadetalle?:Matriculadetalle,


        
        public matricula?:Matricula,
        public id?:number
    ){}
}