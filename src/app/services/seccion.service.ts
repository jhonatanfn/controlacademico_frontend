import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { crudSeccion, listarSecciones } from '../interfaces/seccion.interface';
import { Seccion } from '../models/seccion.model';

const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class SeccionService {

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
    const base= `${base_url}/secciones/todo`;
    return this.http.get<listarSecciones>(base,this.headers);
  }

  listar(desde:number=0){
    const base= `${base_url}/secciones?desde=${desde}`;
    return this.http.get<listarSecciones>(base, this.headers);
  }
  obtener(id:number){
    const url=`${base_url}/secciones/${id}`;
    return this.http.get<crudSeccion>(url,this.headers);
  }
  crear(seccion:Seccion){
    const base= `${base_url}/secciones`;
    return this.http.post<crudSeccion>(base,seccion, this.headers);
  }
  actualizar(id:number, seccion:Seccion){
    const base= `${base_url}/secciones/${id}`;
    return this.http.put<crudSeccion>(base,seccion,this.headers);
  }
  borrar(id:number){
    const base= `${base_url}/secciones/${id}`;
    return this.http.delete<crudSeccion>(base,this.headers);
  }
  buscarPorNombre(termino:string){
    const base=`${base_url}/secciones/busqueda/${termino}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    );
  }
  private transformar(busquedas:any[]):Seccion[]{
    return busquedas.map(
      seccion=>new Seccion(seccion.nombre,seccion.id)
    );
  }

  tieneAulas(seccionId:number){
    const base= `${base_url}/secciones/tieneaulas/${seccionId}`;
    return this.http.get<crudSeccion>(base,this.headers);
  }

}
