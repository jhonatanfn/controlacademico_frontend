import { Area } from "./area.model";
import { Aula } from "./aula.model";
import { Docente } from "./docente.model";
import { Periodo } from "./periodo.model";
import { Subarea } from "./subarea.model";


export class Programacion{

    constructor(
        public periodoId:number,
        public aulaId:number,
        public areaId:number,
        public docenteId:number,
        public periodo?:Periodo,
        public aula?:Aula,
        public area?:Area,
        public docente?:Docente,
        public numeromat?:number,
        public numeromaxmat?:number,
        public id?:number
    ){}
    
}