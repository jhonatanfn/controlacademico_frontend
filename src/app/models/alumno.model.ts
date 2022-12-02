import { Apoderado } from "./apoderado.model";
import { Madre } from "./madre.model";
import { Padre } from "./padre.model";
import { Persona } from "./persona.model";
import { Responsable } from "./responsable.model";


export class Alumno{

    constructor(
        public personaId:number,
        public padreId: number,
        public madreId:number,
        public responsableId?:number,
        public vivecon?:number,
        public tienediscapacidad?:number,
        public certificadiscapacidad?:number,
        public cualdiscapacidad?:string,
        public inicialprocede?:string,
        public colegioprocede?:string,
        public observacion?:string,
        public persona?:Persona,
        public padre?:Padre,
        public madre?:Madre,
        public responsable?:Responsable,
        public id?:number
    ){}
}