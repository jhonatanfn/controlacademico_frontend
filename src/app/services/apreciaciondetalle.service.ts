import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { crudApreciaciondetalle, listarApreciaciondetalles } from '../interfaces/apreciaciondetalle';
import { Apreciaciondetalle } from '../models/apreciaciondetalle';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ApreciaciondetalleService {

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  todo() {
    const base = `${base_url}/apreciaciondetalles/todo`;
    return this.http.get<listarApreciaciondetalles>(base, this.headers);
  }
  listar(desde: number = 0) {
    const base = `${base_url}/apreciaciondetalles?desde=${desde}`;
    return this.http.get<listarApreciaciondetalles>(base, this.headers);
  }
  obtener(id: number) {
    const url = `${base_url}/apreciaciondetalles/${id}`;
    return this.http.get<crudApreciaciondetalle>(url, this.headers);
  }
  crear(apreciaciondetalle: Apreciaciondetalle) {
    const base = `${base_url}/apreciaciondetalles`;
    return this.http.post<crudApreciaciondetalle>(base, apreciaciondetalle, this.headers);
  }
  actualizar(id: number, apreciaciondetalle: Apreciaciondetalle) {
    const base = `${base_url}/apreciaciondetalles/${id}`;
    return this.http.put<crudApreciaciondetalle>(base, apreciaciondetalle, this.headers);
  }
  borrar(id: number) {
    const base = `${base_url}/apreciaciondetalles/${id}`;
    return this.http.delete<crudApreciaciondetalle>(base, this.headers);
  }
  buscar(termino: string) {
    const base = `${base_url}/apreciaciondetalles/busqueda/${termino}`;
    return this.http.get<any[]>(base, this.headers)
      .pipe(
        map((resp: any) => {
          return this.transformar(resp.busquedas)
        })
      );
  }
  private transformar(busquedas: any[]): Apreciaciondetalle[] {
    return busquedas.map(
      apreciaciondetalle => new Apreciaciondetalle(apreciaciondetalle.nombre,apreciaciondetalle.descripcion,apreciaciondetalle.responsabilidad,apreciaciondetalle.apreciacion.id,apreciaciondetalle.apreciacion,apreciaciondetalle.firma,apreciaciondetalle.estado,apreciaciondetalle.id)
    );
  }

  apreciaciondetallesPeriodoAlumno(periodoId:number, alumnoId:number){
    const base = `${base_url}/apreciaciondetalles/periodo/alumno/${periodoId}/${alumnoId}`;
    return this.http.get<listarApreciaciondetalles>(base, this.headers);
  }

  apreciaciondetallesApreciacion(apreciacionId:number){
    const base = `${base_url}/apreciaciondetalles/apreciacion/${apreciacionId}`;
    return this.http.get<listarApreciaciondetalles>(base, this.headers);
  }
}
