import { Alumno } from "./alumno.model";
import { Periodo } from "./periodo.model";

export class Apreciacion {
    constructor(
        public periodoId: number,
        public alumnoId: number,
        public periodo?: Periodo,
        public alumno?: Alumno,
        public estado?: boolean,
        public id?: number
    ) { }
}