import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { crudApreciacion, listarApreciaciones } from '../interfaces/apreciacion.interface';
import { Apreciacion } from '../models/apreciacion.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ApreciacionService {

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
    const base = `${base_url}/apreciaciones/todo`;
    return this.http.get<listarApreciaciones>(base, this.headers);
  }
  listar(desde: number = 0) {
    const base = `${base_url}/apreciaciones?desde=${desde}`;
    return this.http.get<listarApreciaciones>(base, this.headers);
  }
  getApreciacionesPeriodoAlumno(periodoId: number, alumnoId: number) {
    const base = `${base_url}/apreciaciones/alumno/${periodoId}/${alumnoId}`;
    return this.http.get<listarApreciaciones>(base, this.headers);
  }
  obtener(id: number) {
    const url = `${base_url}/apreciaciones/${id}`;
    return this.http.get<crudApreciacion>(url, this.headers);
  }
  crear(apreciacion: Apreciacion) {
    const base = `${base_url}/apreciaciones`;
    return this.http.post<crudApreciacion>(base, apreciacion, this.headers);
  }
  actualizar(id: number, apreciacion: Apreciacion) {
    const base = `${base_url}/apreciaciones/${id}`;
    return this.http.put<crudApreciacion>(base, apreciacion, this.headers);
  }
  borrar(id: number) {
    const base = `${base_url}/apreciaciones/${id}`;
    return this.http.delete<crudApreciacion>(base, this.headers);
  }

  buscar(termino: string) {
    const base = `${base_url}/apreciaciones/busqueda/${termino}`;
    return this.http.get<any[]>(base, this.headers)
      .pipe(
        map((resp: any) => {
          return this.transformar(resp.busquedas)
        })
      );
  }
  private transformar(busquedas: any[]): Apreciacion[] {
    return busquedas.map(
      apreciacion => new Apreciacion(apreciacion.periodoId, apreciacion.alumnoId, apreciacion.periodo, apreciacion.alumno, apreciacion.estado, apreciacion.id)
    );
  }
}
