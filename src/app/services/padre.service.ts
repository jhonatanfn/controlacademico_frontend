import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { crudPadre, listarPadres } from '../interfaces/padre.interface';
import { Padre } from '../models/padre.model';

const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PadreService {

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

  listar(desde:number=0){
    const base= `${base_url}/padres?desde=${desde}`;
    return this.http.get<listarPadres>(base, this.headers);
  }
  todo(){
    const base= `${base_url}/padres/todo`;
    return this.http.get<listarPadres>(base, this.headers);
  }
  obtener(id:number){
    const url=`${base_url}/padres/${id}`;
    return this.http.get<crudPadre>(url,this.headers);
  }
  crear(padre:Padre){
    const base= `${base_url}/padres`;
    return this.http.post<crudPadre>(base,padre, this.headers);
  }
  actualizar(id:number, padre:Padre){
    const base= `${base_url}/padres/${id}`;
    return this.http.put<crudPadre>(base,padre,this.headers);
  }
  borrar(id:number){
    const base= `${base_url}/padres/${id}`;
    return this.http.delete<crudPadre>(base,this.headers);
  }
  searchDNI(dni: string){
    const base = `${base_url}/padres/searchdni/${dni}`;
    return this.http.get<crudPadre>(base, this.headers);
  }
  busqueda(termino:string){
    const base=`${base_url}/padres/busqueda/${termino}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    );
  }

  private transformar(busquedas:any[]):Padre[]{
    return busquedas.map(
      padre=>new Padre(padre.personaId,padre.persona,padre.id)
    );
  }

}
