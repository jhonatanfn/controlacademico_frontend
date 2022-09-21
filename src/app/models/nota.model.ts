import { Ciclo } from "./ciclo.model";
import { Competencia } from "./competencia.model";
import { Evaluacion } from "./evaluacion.model";
import { Matricula } from "./matricula.model";
import { Matriculadetalle } from "./matriculadetalle";


export class Nota{

    constructor(
        public evaluacionId:number,
        public cicloId:number,
        public competenciaId:number,
        public matriculadetalleId:number,
        public valor:number,
        public fecha?:string,
        public hora?:string,
        public evaluacion?:Evaluacion,
        public ciclo?:Ciclo,
        public competencia?:Competencia,
        public matriculadetalle?:Matriculadetalle,
        public id?:number,
        
        public matricula?:Matricula,
        public matriculaId?:number,
    ){}
}