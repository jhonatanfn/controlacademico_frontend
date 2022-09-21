import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { crudPeriodo, listarPeriodos } from '../interfaces/periodo.interface';
import { Periodo } from '../models/periodo.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PeriodoService {

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
  constructor(private http: HttpClient) { }

  todo() {
    const base = `${base_url}/periodos/todo`;
    return this.http.get<listarPeriodos>(base, this.headers);
  }
  listar(desde: number = 0) {
    const base = `${base_url}/periodos?desde=${desde}`;
    return this.http.get<listarPeriodos>(base, this.headers);
  }
  obtener(id: number) {
    const url = `${base_url}/periodos/${id}`;
    return this.http.get<crudPeriodo>(url, this.headers);
  }
  crear(periodo: Periodo) {
    const base = `${base_url}/periodos`;
    return this.http.post<crudPeriodo>(base, periodo, this.headers);
  }
  actualizar(id: number, periodo: Periodo) {
    const base = `${base_url}/periodos/${id}`;
    return this.http.put<crudPeriodo>(base, periodo, this.headers);
  }
  borrar(id: number) {
    const base = `${base_url}/periodos/${id}`;
    return this.http.delete<crudPeriodo>(base, this.headers);
  }
  porNombre(nombre:string){
    const url = `${base_url}/periodos/consulta/${nombre}`;
    return this.http.get<crudPeriodo>(url, this.headers);
  }

  buscarPorNombre(termino: string) {
    const base = `${base_url}/periodos/busqueda/${termino}`;
    return this.http.get<any[]>(base, this.headers)
      .pipe(
        map((resp: any) => {
          return this.transformar(resp.busquedas)
        })
      );
  }
  private transformar(busquedas: any[]): Periodo[] {
    return busquedas.map(
      periodo => new Periodo(periodo.nombre, periodo.fechainicial, periodo.fechafinal, periodo.id)
    );
  }

  tieneProgramaciones(periodoId: number) {
    const base = `${base_url}/periodos/tieneprogramaciones/${periodoId}`;
    return this.http.get<crudPeriodo>(base, this.headers);
  }

}
