import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { crudApoderado, listarApoderados } from '../interfaces/apoderado.interface';
import { Apoderado } from '../models/apoderado.model';


const base_url= environment.base_url; 

@Injectable({
  providedIn: 'root'
})
export class ApoderadoService {

  constructor(private http:HttpClient) { }

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

  todo(){
    const base= `${base_url}/apoderados/filtrado/todo`;
    return this.http.get<listarApoderados>(base, this.headers);
  }

  listar(desde:number=0){
    const base= `${base_url}/apoderados?desde=${desde}`;
    return this.http.get<listarApoderados>(base, this.headers);
  }
  obtener(id:number){
    const url=`${base_url}/apoderados/${id}`;
    return this.http.get<crudApoderado>(url,this.headers);
  }
  crear(apoderado:Apoderado){
    const base= `${base_url}/apoderados`;
    return this.http.post<crudApoderado>(base,apoderado, this.headers);
  }
  actualizar(id:number, apoderado:Apoderado){
    const base= `${base_url}/apoderados/${id}`;
    return this.http.put<crudApoderado>(base,apoderado,this.headers);
  }
  borrar(id:number){
    const base= `${base_url}/apoderados/${id}`;
    return this.http.delete<crudApoderado>(base,this.headers);
  }
  consultarNumero(numero:string){
    const base= `${base_url}/apoderados/documento/${numero}`;
    return this.http.get<crudApoderado>(base,this.headers);
  }
  buscarPorNombre(termino:string){
    const base=`${base_url}/apoderados/busqueda/${termino}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    );
  }
  buscarPorApellido(termino:string){
    const base=`${base_url}/apoderados/busqueda/apellido/${termino}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    );
  }

  buscarPorDocumento(termino:string){
    const base=`${base_url}/apoderados/busqueda/documento/${termino}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    );
  }

  buscarPorNombres(termino:string){
    const base=`${base_url}/apoderados/busqueda/nombres/${termino}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    );
  }

  private transformar(busquedas:any[]):Apoderado[]{
    return busquedas.map(
      apoderado=>new Apoderado(apoderado.personaId,apoderado.persona,apoderado.id)
    );
  }

  tieneAlumnos(apoderadoId:number){
    const base=`${base_url}/apoderados/tienealumnos/${apoderadoId}`;
    return this.http.get<crudApoderado>(base,this.headers);
  }

  
}
