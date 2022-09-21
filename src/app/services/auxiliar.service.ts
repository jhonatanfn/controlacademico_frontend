import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { crudAuxiliar, listarAuxiliares } from '../interfaces/auxiliar.interface';
import { Auxiliar } from '../models/auxiliar.model';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class AuxiliarService {

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
    const url = `${base_url}/auxiliares/todo`;
    return this.http.get<listarAuxiliares>(url, this.headers);
  }

  listar(desde: number = 0) {
    const url = `${base_url}/auxiliares?desde=${desde}`;
    return this.http.get<listarAuxiliares>(url, this.headers);
  }
  obtener(id: number) {
    const url = `${base_url}/auxiliares/${id}`;
    return this.http.get<crudAuxiliar>(url, this.headers);
  }
  crear(auxiliar: Auxiliar) {
    const base = `${base_url}/auxiliares`;
    return this.http.post<crudAuxiliar>(base, auxiliar, this.headers);
  }
  actualizar(id: number, auxiliar: Auxiliar) {
    const base = `${base_url}/auxiliares/${id}`;
    return this.http.put<crudAuxiliar>(base, auxiliar, this.headers);
  }
  borrar(id: number) {
    const base = `${base_url}/auxiliares/${id}`;
    return this.http.delete<crudAuxiliar>(base, this.headers);
  }
  buscar(termino: string) {
    const base = `${base_url}/auxiliares/busqueda/${termino}`;
    return this.http.get<any[]>(base, this.headers)
      .pipe(
        map((resp: any) => {
          return this.transformar(resp.busquedas)
        })
      );
  }
  searchDNI(dni: string) {
    const base = `${base_url}/auxiliares/searchdni/${dni}`;
    return this.http.get<crudAuxiliar>(base, this.headers);
  }

  private transformar(busquedas: any[]): Auxiliar[] {
    return busquedas.map(
      auxiliar => new Auxiliar(auxiliar.personaId, auxiliar.persona, auxiliar.numero, auxiliar.estado, auxiliar.id)
    );
  }

}
