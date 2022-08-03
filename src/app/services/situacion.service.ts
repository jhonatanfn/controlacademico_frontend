import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { crudSituacion, listarSituaciones } from '../interfaces/situacion.interface';
import { Situacion } from '../models/situacion.model';

const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class SituacionService {

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
  
  todo(){
    const base= `${base_url}/situaciones/todo`;
    return this.http.get<listarSituaciones>(base,this.headers);
  }
  listar(desde:number=0){
    const base= `${base_url}/situaciones?desde=${desde}`;
    return this.http.get<listarSituaciones>(base, this.headers);
  }
  obtener(id:number){
    const url=`${base_url}/situaciones/${id}`;
    return this.http.get<crudSituacion>(url,this.headers);
  }
  crear(situacion:Situacion){
    const base= `${base_url}/situaciones`;
    return this.http.post<crudSituacion>(base,situacion, this.headers);
  }
  actualizar(id:number, situacion:Situacion){
    const base= `${base_url}/situaciones/${id}`;
    return this.http.put<crudSituacion>(base,situacion,this.headers);
  }
  borrar(id:number){
    const base= `${base_url}/situaciones/${id}`;
    return this.http.delete<crudSituacion>(base,this.headers);
  }

  buscarPorNombre(termino:string){
    const base=`${base_url}/niveles/busqueda/${termino}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    );
  }
  private transformar(busquedas:any[]):Situacion[]{
    return busquedas.map(
      situacion=>new Situacion(situacion.nombre,situacion.abreviatura,situacion.id)
    );
  }
}
