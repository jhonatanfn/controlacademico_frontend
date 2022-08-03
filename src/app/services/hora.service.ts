import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { crudHora, listarHoras } from '../interfaces/hora.interface';
import { Hora } from '../models/hora.model';


const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HoraService {

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
    const base = `${base_url}/horas/todo`;
    return this.http.get<listarHoras>(base, this.headers);
  }
  listar(desde: number = 0) {
    const base = `${base_url}/horas?desde=${desde}`;
    return this.http.get<listarHoras>(base, this.headers);
  }
  obtener(id: number) {
    const url = `${base_url}/horas/${id}`;
    return this.http.get<crudHora>(url, this.headers);
  }
  crear(hora: Hora) {
    const base = `${base_url}/horas`;
    return this.http.post<crudHora>(base, hora, this.headers);
  }
  actualizar(id: number, hora: Hora) {
    const base = `${base_url}/horas/${id}`;
    return this.http.put<crudHora>(base, hora, this.headers);
  }
  borrar(id: number) {
    const base = `${base_url}/horas/${id}`;
    return this.http.delete<crudHora>(base, this.headers);
  }

  buscarPorNombre(termino: string) {
    const base = `${base_url}/horas/busqueda/${termino}`;
    return this.http.get<any[]>(base, this.headers)
      .pipe(
        map((resp: any) => {
          return this.transformar(resp.busquedas)
        })
      );
  }
  private transformar(busquedas: any[]): Hora[] {
    return busquedas.map(
      hora => new Hora(hora.nombre, hora.inicio, hora.fin,hora.tipo, hora.id)
    );
  }
  tieneHorarios(horaId: number) {
    const base = `${base_url}/horas/tienehorarios/${horaId}`;
    return this.http.get<crudHora>(base, this.headers);
  }

}
