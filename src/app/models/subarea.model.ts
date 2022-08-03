import { Area } from "./area.model";

export class Subarea{
    constructor(
        public nombre:string,
        public area:Area,
        public id?:number,
    ){}
}