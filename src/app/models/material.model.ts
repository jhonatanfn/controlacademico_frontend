import { Programacion } from "./programacion.model";


export class Material{
    constructor(
        public titulo:string,
        public subtitulo:string,
        public descripcion:string,
        public programacion?:Programacion,
        public archivo?:string,
        public fecha?:string,
        public id?:number
    ){}
}