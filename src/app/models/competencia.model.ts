import { Area } from "./area.model";

export class Competencia{
    constructor(
        public descripcion: string,
        public areaId:number,
        public area?:Area,
        public estado?: boolean,
        public id?: number
    ) { }
}