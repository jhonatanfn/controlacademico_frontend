import { Apreciacion } from "./apreciacion.model";

export class Apreciaciondetalle {
    constructor(
        public nombre:string,
        public descripcion:string,
        public responsabilidad:string,
        public apreciacionId:number,
        public apreciacion?:Apreciacion,
        public firma?:string,
        public estado?: boolean,
        public id?: number
    ) { }
}