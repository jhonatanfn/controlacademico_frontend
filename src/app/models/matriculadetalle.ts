import { Matricula } from "./matricula.model";
import { Programacion } from "./programacion.model";

export class Matriculadetalle{

    constructor(
        public programacionId:number,
        public matriculaId:number,
        public programacion?:Programacion,
        public matricula?:Matricula,
        public id?:number,
    ){}
    
}