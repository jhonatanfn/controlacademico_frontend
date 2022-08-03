import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { crudRango, listarRangos } from '../interfaces/rango.interface';
import { Rango } from '../models/rango.model';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class RangoService {

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
    const base = `${base_url}/rangos/todo`;
    return this.http.get<listarRangos>(base, this.headers);
  }
  listar(desde: number = 0) {
    const base = `${base_url}/rangos?desde=${desde}`;
    return this.http.get<listarRangos>(base, this.headers);
  }
  obtener(id: number) {
    const url = `${base_url}/rangos/${id}`;
    return this.http.get<crudRango>(url, this.headers);
  }
  crear(rango: Rango) {
    const base = `${base_url}/rangos`;
    return this.http.post<crudRango>(base, rango, this.headers);
  }
  actualizar(id: number, rango: Rango) {
    const base = `${base_url}/rangos/${id}`;
    return this.http.put<crudRango>(base, rango, this.headers);
  }
  borrar(id: number) {
    const base = `${base_url}/rangos/${id}`;
    return this.http.delete<crudRango>(base, this.headers);
  }

  buscarPorNombre(termino: string) {
    const base = `${base_url}/rangos/busqueda/${termino}`;
    return this.http.get<any[]>(base, this.headers)
      .pipe(
        map((resp: any) => {
          return this.transformar(resp.busquedas)
        })
      );
  }
  private transformar(busquedas: any[]): Rango[] {
    return busquedas.map(
      rango => new Rango(rango.letra, rango.inicio, rango.fin, rango.situacion,rango.color,rango.alias, rango.id)
    );
  }
}
