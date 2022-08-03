import { Matricula } from "./matricula.model";
import { Situacion } from "./situacion.model";

export class Asistencia{
    constructor(
        public situacion?:Situacion,
        public matricula?:Matricula,
        public fecha?:string,
        public hora?:string,
        public id?:number
    ){}
}