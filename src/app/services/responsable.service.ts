import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { crudResponsable, listarResponsables } from '../interfaces/responsable.interface';
import { Responsable } from '../models/responsable.model';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class ResponsableService {

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

  listar(desde: number = 0) {
    const base = `${base_url}/responsables?desde=${desde}`;
    return this.http.get<listarResponsables>(base, this.headers);
  }
  todo() {
    const base = `${base_url}/responsables/todo`;
    return this.http.get<listarResponsables>(base, this.headers);
  }
  obtener(id: number) {
    const url = `${base_url}/responsables/${id}`;
    return this.http.get<crudResponsable>(url, this.headers);
  }
  crear(responsable: Responsable) {
    const base = `${base_url}/responsables`;
    return this.http.post<crudResponsable>(base, responsable, this.headers);
  }
  actualizar(id: number, responsable: Responsable) {
    const base = `${base_url}/responsables/${id}`;
    return this.http.put<crudResponsable>(base, responsable, this.headers);
  }
  borrar(id: number) {
    const base = `${base_url}/responsables/${id}`;
    return this.http.delete<crudResponsable>(base, this.headers);
  }
  searchDNI(dni: string) {
    const base = `${base_url}/responsables/searchdni/${dni}`;
    return this.http.get<crudResponsable>(base, this.headers);
  }
  busqueda(termino: string) {
    const base = `${base_url}/responsables/busqueda/${termino}`;
    return this.http.get<any[]>(base, this.headers)
      .pipe(
        map((resp: any) => {
          return this.transformar(resp.busquedas)
        })
      );
  }

  private transformar(busquedas: any[]): Responsable[] {
    return busquedas.map(
      responsable => new Responsable(responsable.personaId, responsable.persona, responsable.id)
    );
  }

  consultadniResponsable(dni: string) {
    const url = `${base_url}/responsables/consultadni/${dni}`;
    return this.http.get<crudResponsable>(url, this.headers);
  }
}
