import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { crudMaterial, listarMateriales } from '../interfaces/material.interface';
import { Material } from '../models/material.model';

const base_url= environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class MaterialService {

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

  listar(desde:number=0){
    const base= `${base_url}/materiales?desde=${desde}`;
    return this.http.get<listarMateriales>(base, this.headers);
  }
  obtener(id:number){
    const url=`${base_url}/materiales/${id}`;
    return this.http.get<crudMaterial>(url,this.headers);
  }
  crear(material:Material){
    const base= `${base_url}/materiales`;
    return this.http.post<crudMaterial>(base,material, this.headers);
  }
  actualizar(id:number, material:Material){
    const base= `${base_url}/materiales/${id}`;
    return this.http.put<crudMaterial>(base,material,this.headers);
  }
  borrar(id:number){
    const base= `${base_url}/materiales/${id}`;
    return this.http.delete<crudMaterial>(base,this.headers);
  }

  porProgramacion(programacion:number,desde:number=0){
    const base= `${base_url}/materiales/programacion/${programacion}?desde=${desde}`;
    return this.http.get<listarMateriales>(base, this.headers);
  }

  async actualizarArchivo(archivo: File, id: number) {
    try {
      const url = `${base_url}/uploads/material/${id}`;
      const formData = new FormData();
      formData.append('archivo', archivo);
      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': this.token
        },
        body: formData
      });
      const data = await resp.json();
      return data;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  private transformar(busquedas:any[]):Material[]{
    return busquedas.map(
      material=>new Material(material.titulo,material.subtitulo,material.descripcion,material.programacion,
        material.archivo,material.fecha,material.id)
    );
  }
  buscar(termino:string){
    const url= `${base_url}/materiales/busqueda/${termino}`;
    return this.http.get<any[]>(url, this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    )
  }

  buscarprogramacion(termino:string,programacionId:number){
    const url= `${base_url}/materiales/busqueda/programacion/${programacionId}/${termino}`;
    return this.http.get<any[]>(url, this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    )
  }

}
