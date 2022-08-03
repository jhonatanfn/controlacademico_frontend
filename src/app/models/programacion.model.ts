import { Aula } from "./aula.model";
import { Docente } from "./docente.model";
import { Periodo } from "./periodo.model";
import { Subarea } from "./subarea.model";


export class Programacion{

    constructor(
        public periodoId:number,
        public aulaId:number,
        public subareaId:number,
        public docenteId:number,
        public periodo?:Periodo,
        public aula?:Aula,
        public subarea?:Subarea,
        public docente?:Docente,
        public numeromat?:number,
        public numeromaxmat?:number,
        public id?:number
    ){}
    
}