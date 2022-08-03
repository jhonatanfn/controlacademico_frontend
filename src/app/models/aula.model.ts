import { Grado } from "./grado.model";
import { Nivel } from "./nivel.model";
import { Seccion } from "./seccion.model";


export class Aula{

    constructor(
        public nombre:string,
        public nivel:Nivel,
        public grado:Grado,
        public seccion:Seccion,
        public id?:number
    ){}
}