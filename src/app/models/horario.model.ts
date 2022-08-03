import { Hora } from "./hora.model";
import { Programacion } from "./programacion.model";

export class Horario{

    constructor(
        public dia:string,
        public horaId:number,
        public programacionId:number,
        public hora?:Hora,
        public programacion?:Programacion,
        public id?:number
    ){}
    
}