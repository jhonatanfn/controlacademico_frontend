import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { crudSubarea, listarSubareas } from '../interfaces/subarea.interface';
import { Subarea } from '../models/subarea.model';

const base_url=environment.base_url;
@Injectable({
  providedIn: 'root'
})
export class SubareaService {

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
    const url = `${base_url}/subareas/todo`;
    return this.http.get<listarSubareas>(url,this.headers);
  }

  porArea(id:string){
    const url = `${base_url}/subareas/area/${id}`;
    return this.http.get<listarSubareas>(url,this.headers);
  }

  listar(desde:number=0){
    const url = `${base_url}/subareas?desde=${desde}`;
    return this.http.get<listarSubareas>(url,this.headers);
  }

  obtener(id:number){
    const url=`${base_url}/subareas/${id}`;
    return this.http.get<crudSubarea>(url,this.headers);
  }
  crear(subarea:Subarea){
    const base= `${base_url}/subareas`;
    return this.http.post<crudSubarea>(base,subarea, this.headers);
  }
  actualizar(id:number, subarea:Subarea){
    const base= `${base_url}/subareas/${id}`;
    return this.http.put<crudSubarea>(base,subarea,this.headers);
  }
  borrar(id:number){
    const base= `${base_url}/subareas/${id}`;
    return this.http.delete<crudSubarea>(base,this.headers);
  }
  buscarPorNombre(termino:string){
    const base=`${base_url}/subareas/busqueda/${termino}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    );
  }
  private transformar(busquedas:any[]):Subarea[]{
    return busquedas.map(
      subarea=>new Subarea(subarea.nombre,subarea.area,subarea.id)
    );
  }

  tieneProgramaciones(subareaId:number){
    const base= `${base_url}/subareas/tieneprogramaciones/${subareaId}`;
    return this.http.get<crudSubarea>(base,this.headers);
  }
}
