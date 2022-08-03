import { Ciclo } from "./ciclo.model";
import { Evaluacion } from "./evaluacion.model";
import { Matricula } from "./matricula.model";


export class Nota{

    constructor(
        public matriculaId:number,
        public evaluacionId:number,
        public cicloId:number,
        public valor:number,
        public fecha:string,
        public matricula?:Matricula,
        public evaluacion?:Evaluacion,
        public ciclo?:Ciclo,
        public id?:number
    ){}
}