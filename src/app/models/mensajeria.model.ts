
export class Mensajeria{

    constructor(
        public emisor:string,
        public receptor:string,
        public asunto:string,
        public contenido:string,
        public fecha:string,
        public hora:string,
        public xemisor: boolean,
        public xreceptor: boolean,
        public lemisor: boolean,
        public lreceptor: boolean,
        public archivo?:string,
        public estado?:boolean,
        public id?:number
    ){}

}