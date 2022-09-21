import { Apreciacion } from "./apreciacion.model";


export class Periodo{

    constructor(
        public nombre:string,
        public fechainicial:string,
        public fechafinal:string,
        public apreciacion?:Apreciacion[],
        public id?:number
    ){}

}