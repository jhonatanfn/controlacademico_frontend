

export class Institucion{

    constructor(
        public nombre: string,
        public direccion:string,
        public telefono: string,
        public email: string,
        public img?: string,
        public departamento?:string,
        public provincia?:string,
        public distrito?:string,
        public centropoblado?:string,
        public dre?:string,
        public ugel?:string,
        public tipogestion?:string,
        public generoalumno?:string,
        public formaatencion?:string,
        public turnoatencion?:string,
        public paginaweb?:string,
        public estado?:boolean,
        public id?:number
    ){}
}