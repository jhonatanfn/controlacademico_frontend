
import { Alumno } from "./alumno.model";
import { Nota } from "./nota.model";
import { Programacion } from "./programacion.model";

export class Matricula{

    constructor(
        public alumnoId:number,
        public alumno?:Alumno,
        public fecha?:string,
        public hora?:string,
        public id?:number,
        public programacion?:Programacion,
        public nota?:Nota
    ){}
}