import { Alumno } from "./alumno.model";
import { Periodo } from "./periodo.model";

export class Apreciacion {
    constructor(
        public nombre: string,
        public descripcion: string,
        public periodoId: number,
        public alumnoId: number,
        public periodo?: Periodo,
        public alumno?: Alumno,
        public responsabilidad?: string,
        public estado?: boolean,
        public id?: number
    ) { }
}