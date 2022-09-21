import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { crudArea, listarAreas } from '../interfaces/area.interface';
import { Area } from '../models/area.model';

const base_url=environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AreaService {

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
    const base= `${base_url}/areas/todo`;
    return this.http.get<listarAreas>(base, this.headers);
  }
  listar(desde:number=0){
    const base= `${base_url}/areas?desde=${desde}`;
    return this.http.get<listarAreas>(base, this.headers);
  }
  obtener(id:number){
    const url=`${base_url}/areas/${id}`;
    return this.http.get<crudArea>(url,this.headers);
  }
  crear(area:Area){
    const base= `${base_url}/areas`;
    return this.http.post<crudArea>(base,area, this.headers);
  }
  actualizar(id:number, area:Area){
    const base= `${base_url}/areas/${id}`;
    return this.http.put<crudArea>(base,area,this.headers);
  }
  borrar(id:number){
    const base= `${base_url}/areas/${id}`;
    return this.http.delete<crudArea>(base,this.headers);
  }

  buscarPorNombre(termino:string){
    const base=`${base_url}/areas/busqueda/${termino}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    );
  }
  private transformar(busquedas:any[]):Area[]{
    return busquedas.map(
      area=>new Area(area.nombre,area.img,area.id)
    );
  }

  async actualizarImagen(archivo: File, id: number) {
    try {
      const url = `${base_url}/uploads/area/${id}`;
      const formData = new FormData();
      formData.append('imagen', archivo);
      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': this.token
        },
        body: formData
      });
      const data = await resp.json();
      return data.nombreArchivo;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  tieneSubareas(areaId:number){
    const base= `${base_url}/areas/tienesubareas/${areaId}`;
    return this.http.get<crudArea>(base,this.headers);
  }

  tieneCompetencias(areaId:number){
    const base= `${base_url}/areas/tienecompetencias/${areaId}`;
    return this.http.get<crudArea>(base,this.headers);
  }

  existeNombreArea(areaNombre:string){
    const base= `${base_url}/areas/nombrerepetido/${areaNombre}`;
    return this.http.get<crudArea>(base,this.headers);
  }
  existeNombreAreaEditar(areaId:number,areaNombre:string){
    const base= `${base_url}/areas/nombrerepetidoeditar/${areaId}/${areaNombre}`;
    return this.http.get<crudArea>(base,this.headers);
  }
  listaAreasCompetencias(){
    const base= `${base_url}/areas/competencias`;
    return this.http.get<listarAreas>(base, this.headers);
  }

}
