import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { crudGrado, listarGrados } from '../interfaces/grado.interface';
import { Grado } from '../models/grado.model';

const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class GradoService {

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
    const base=`${base_url}/grados/todo`;
    return this.http.get<listarGrados>(base,this.headers);
  }

  listar(desde:number=0){
    const base= `${base_url}/grados?desde=${desde}`;
    return this.http.get<listarGrados>(base, this.headers);
  }
  obtener(id:number){
    const url=`${base_url}/grados/${id}`;
    return this.http.get<crudGrado>(url,this.headers);
  }
  crear(grado:Grado){
    const base= `${base_url}/grados`;
    return this.http.post<crudGrado>(base,grado, this.headers);
  }
  actualizar(id:number, grado:Grado){
    const base= `${base_url}/grados/${id}`;
    return this.http.put<crudGrado>(base,grado,this.headers);
  }
  borrar(id:number){
    const base= `${base_url}/grados/${id}`;
    return this.http.delete<crudGrado>(base,this.headers);
  }
  buscarPorNombre(termino:string){
    const base=`${base_url}/grados/busqueda/${termino}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    );
  }
  private transformar(busquedas:any[]):Grado[]{
    return busquedas.map(
      grado=>new Grado(grado.nombre,grado.id)
    );
  }

  tieneAulas(gradoId:number){
    const base= `${base_url}/grados/tieneaulas/${gradoId}`;
    return this.http.get<crudGrado>(base,this.headers);
  }
  existeNombreGrado(gradoNombre:string){
    const base= `${base_url}/grados/nombrerepetido/${gradoNombre}`;
    return this.http.get<crudGrado>(base,this.headers);
  }
  existeNombreGradoEditar(gradoId:number,gradoNombre:string){
    const base= `${base_url}/grados/nombrerepetidoeditar/${gradoId}/${gradoNombre}`;
    return this.http.get<crudGrado>(base,this.headers);
  }
}
