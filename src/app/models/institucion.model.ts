

export class Institucion{

    constructor(
        public nombre: string,
        public direccion:string,
        public telefono: string,
        public email: string,
        public img?: string,
        public estado?:boolean,
        public id?:number
    ){}
}