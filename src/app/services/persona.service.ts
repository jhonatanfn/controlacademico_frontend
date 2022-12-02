import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { crudPersona, listarPersona } from '../interfaces/persona.interface';
import { Persona } from '../models/persona.model';

const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  constructor(private http:HttpClient) {}

  get token():string{
    return localStorage.getItem('token') || '';
  }

  get headers(){
    return {
      headers:{
        'x-token':this.token
      }
    }
  }

  listar(){
    const base= `${base_url}/personas`;
    return this.http.get<listarPersona>(base, this.headers);
  }
  crear(persona:Persona){
    const base= `${base_url}/personas`;
    return this.http.post<crudPersona>(base,persona, this.headers);
  }
  actualizar(id:number, persona:Persona){
    const base= `${base_url}/personas/${id}`;
    return this.http.put<crudPersona>(base,persona,this.headers);
  }
  borrar(id:number){
    const base= `${base_url}/personas/${id}`;
    return this.http.delete<crudPersona>(base,this.headers);
  }

  existePersona(dni:string){
    const base= `${base_url}/personas/consultadni/${dni}`;
    return this.http.get<crudPersona>(base,this.headers);
  }

}
