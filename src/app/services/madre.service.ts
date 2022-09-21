import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { crudMadre, listarMadres } from '../interfaces/madre.interface';
import { Madre } from '../models/madre.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MadreService {

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
    const base = `${base_url}/madres?desde=${desde}`;
    return this.http.get<listarMadres>(base, this.headers);
  }
  todo(){
    const base = `${base_url}/madres/todo`;
    return this.http.get<listarMadres>(base, this.headers);
  }
  obtener(id: number) {
    const url = `${base_url}/madres/${id}`;
    return this.http.get<crudMadre>(url, this.headers);
  }
  crear(madre: Madre) {
    const base = `${base_url}/madres`;
    return this.http.post<crudMadre>(base, madre, this.headers);
  }
  actualizar(id: number, madre: Madre) {
    const base = `${base_url}/madres/${id}`;
    return this.http.put<crudMadre>(base, madre, this.headers);
  }
  borrar(id: number) {
    const base = `${base_url}/madres/${id}`;
    return this.http.delete<crudMadre>(base, this.headers);
  }
  searchDNI(dni: string) {
    const base = `${base_url}/madres/searchdni/${dni}`;
    return this.http.get<crudMadre>(base, this.headers);
  }
  busqueda(termino: string) {
    const base = `${base_url}/madres/busqueda/${termino}`;
    return this.http.get<any[]>(base, this.headers)
      .pipe(
        map((resp: any) => {
          return this.transformar(resp.busquedas)
        })
      );
  }
  private transformar(busquedas: any[]): Madre[] {
    return busquedas.map(
      madre => new Madre(madre.personaId, madre.persona, madre.id)
    );
  }
}
