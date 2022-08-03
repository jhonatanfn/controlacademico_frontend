import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { crudNivel, listarNiveles } from '../interfaces/nivel.interface';
import { Nivel } from '../models/nivel.model';

const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class NivelService {

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
    const base= `${base_url}/niveles/todo`;
    return this.http.get<listarNiveles>(base,this.headers);
  }
  listar(desde:number=0){
    const base= `${base_url}/niveles?desde=${desde}`;
    return this.http.get<listarNiveles>(base, this.headers);
  }
  obtener(id:number){
    const url=`${base_url}/niveles/${id}`;
    return this.http.get<crudNivel>(url,this.headers);
  }
  crear(nivel:Nivel){
    const base= `${base_url}/niveles`;
    return this.http.post<crudNivel>(base,nivel, this.headers);
  }
  actualizar(id:number, nivel:Nivel){
    const base= `${base_url}/niveles/${id}`;
    return this.http.put<crudNivel>(base,nivel,this.headers);
  }
  borrar(id:number){
    const base= `${base_url}/niveles/${id}`;
    return this.http.delete<crudNivel>(base,this.headers);
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
  private transformar(busquedas:any[]):Nivel[]{
    return busquedas.map(
      nivel=>new Nivel(nivel.nombre,nivel.id)
    );
  }

  tieneAulas(nivelId:number){
    const base= `${base_url}/niveles/tieneaulas/${nivelId}`;
    return this.http.get<crudNivel>(base,this.headers);
  }
}
