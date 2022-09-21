import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { crudDirector, listarDirectores } from '../interfaces/director.interface';
import { Director } from '../models/director.model';

const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class DirectorService {

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
    const url=`${base_url}/directores/todo`;
    return this.http.get<listarDirectores>(url,this.headers);
  }

  listar(desde:number=0){
    const url=`${base_url}/directores?desde=${desde}`;
    return this.http.get<listarDirectores>(url,this.headers);
  }
  obtener(id:number){
    const url=`${base_url}/directores/${id}`;
    return this.http.get<crudDirector>(url,this.headers);
  }
  crear(director:Director){
    const base= `${base_url}/directores`;
    return this.http.post<crudDirector>(base,director, this.headers);
  }
  actualizar(id:number, director:Director){
    const base= `${base_url}/directores/${id}`;
    return this.http.put<crudDirector>(base,director,this.headers);
  }
  borrar(id:number){
    const base= `${base_url}/directores/${id}`;
    return this.http.delete<crudDirector>(base,this.headers);
  }

  buscar(termino:string){
    const base=`${base_url}/directores/busqueda/${termino}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    );
  }

  searchDNI(dni: string){
    const base = `${base_url}/directores/searchdni/${dni}`;
    return this.http.get<crudDirector>(base, this.headers);
  }

  private transformar(busquedas:any[]):Director[]{
    return busquedas.map(
      director=>new Director(director.personaId,director.observacion,director.vigente,director.persona,director.estado,director.id)
    );
  }


}
