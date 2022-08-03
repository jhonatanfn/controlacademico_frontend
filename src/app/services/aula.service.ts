import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { crudAula, listarAulas } from '../interfaces/aula.interface';
import { Aula } from '../models/aula.model';

const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AulaService {

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
    const base= `${base_url}/aulas/todo`;
    return this.http.get<listarAulas>(base, this.headers);
  }
 
  listar(desde:number=0){
    const base= `${base_url}/aulas?desde=${desde}`;
    return this.http.get<listarAulas>(base, this.headers);
  }
  obtener(id:number){
    const url=`${base_url}/aulas/${id}`;
    return this.http.get<crudAula>(url,this.headers);
  }
  crear(aula:Aula){
    const base= `${base_url}/aulas`;
    return this.http.post<crudAula>(base,aula, this.headers);
  }
  actualizar(id:number, aula:Aula){
    const base= `${base_url}/aulas/${id}`;
    return this.http.put<crudAula>(base,aula,this.headers);
  }
  borrar(id:number){
    const base= `${base_url}/aulas/${id}`;
    return this.http.delete<crudAula>(base,this.headers);
  }

  getAula(nivel:number,grado:number,seccion:number){
    const base= `${base_url}/aulas/aula/${nivel}/${grado}/${seccion}`;
    return this.http.get<crudAula>(base,this.headers);
  }

  buscarPorNombre(termino:string){
    const base=`${base_url}/aulas/busqueda/${termino}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    );
  }

  buscarAulas(termino:string){
    const base=`${base_url}/aulas/busquedatotal/${termino}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    );
  }
  private transformar(busquedas:any[]):Aula[]{
    return busquedas.map(
      aula=>new Aula(aula.nombre,aula.nivel,aula.grado,aula.seccion,aula.id)
    );
  }

  tieneProgramaciones(aulaId:number){
    const base= `${base_url}/aulas/tieneprogramaciones/${aulaId}`;
    return this.http.get<crudAula>(base,this.headers);
  }

}
