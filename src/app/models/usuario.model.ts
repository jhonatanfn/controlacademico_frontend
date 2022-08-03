import { environment } from "src/environments/environment";
import { Persona } from "./persona.model";
import { Role } from "./role.model";

const base_url= environment.base_url;

export class Usuario{

    constructor(
        public nombre:string,
        public email:string,
        public password:string,
        public role:Role,
        public persona:Persona,
        public habilitado?:boolean,
        public estado?:boolean,
        public id?:number,
    ){}

    
    get imagenUrl(){
        if(this.persona.img){
            return `${base_url}/uploads/${this.persona.img}`;
        }else{
            return `${base_url}/uploads/no-image`;
        }
    }


}