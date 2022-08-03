
import { Alumno } from "./alumno.model";
import { Nota } from "./nota.model";
import { Programacion } from "./programacion.model";

export class Matricula{

    constructor(
        public alumnoId:number,
        public programacionId:number,
        public nota: Nota[],
        public alumno?:Alumno,
        public programacion?:Programacion,
        public id?:number
    ){}
}