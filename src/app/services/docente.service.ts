import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { crudDocente, listarDocentes } from '../interfaces/docente.interface';
import { Docente } from '../models/docente.model';

const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class DocenteService {

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
    const url=`${base_url}/docentes/todo`;
    return this.http.get<listarDocentes>(url,this.headers);
  }

  listar(desde:number=0){
    const url=`${base_url}/docentes?desde=${desde}`;
    return this.http.get<listarDocentes>(url,this.headers);
  }
  obtener(id:number){
    const url=`${base_url}/docentes/${id}`;
    return this.http.get<crudDocente>(url,this.headers);
  }
  crear(docente:Docente){
    const base= `${base_url}/docentes`;
    return this.http.post<crudDocente>(base,docente, this.headers);
  }
  actualizar(id:number, docente:Docente){
    const base= `${base_url}/docentes/${id}`;
    return this.http.put<crudDocente>(base,docente,this.headers);
  }
  borrar(id:number){
    const base= `${base_url}/docentes/${id}`;
    return this.http.delete<crudDocente>(base,this.headers);
  }

  buscarPorNombre(termino:string){
    const base=`${base_url}/docentes/busqueda/${termino}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    );
  }

  buscarPorApellido(termino:string){
    const base=`${base_url}/docentes/busqueda/apellido/${termino}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    );
  }

  buscarDocumento(termino:string){
    const base=`${base_url}/docentes/busqueda/documento/${termino}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    );
  }

  buscarNombres(termino:string){
    const base=`${base_url}/docentes/busqueda/nombres/${termino}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    );
  }


  private transformar(busquedas:any[]):Docente[]{
    return busquedas.map(
      docente=>new Docente(docente.personaId,docente.numero,docente.persona,docente.estado,docente.id)
    );
  }

  tieneProgramacion(docenteId:number){
    const base=`${base_url}/docentes/tieneprogramaciones/${docenteId}`;
    return this.http.get<crudDocente>(base,this.headers);
  }

}
