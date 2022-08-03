import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { crudHorario, listarHorarios } from '../interfaces/horario.interface';
import { Horario } from '../models/horario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HorarioService {

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

  dias: any[] = [
    { id: 1, nombre: 'LUNES' },
    { id: 2, nombre: 'MARTES' },
    { id: 4, nombre: 'MIÉRCOLES' },
    { id: 5, nombre: 'JUEVES' },
    { id: 6, nombre: 'VIERNES' }
  ];

  todo() {
    const base = `${base_url}/horarios/todo`;
    return this.http.get<listarHorarios>(base, this.headers);
  }
  listar(desde: number = 0) {
    const base = `${base_url}/horarios?desde=${desde}`;
    return this.http.get<listarHorarios>(base, this.headers);
  }

  obtener(id: number) {
    const url = `${base_url}/horarios/${id}`;
    return this.http.get<crudHorario>(url, this.headers);
  }
  crear(horario: Horario) {
    const base = `${base_url}/horarios`;
    return this.http.post<crudHorario>(base, horario, this.headers);
  }
  actualizar(id: number, horario: Horario) {
    const base = `${base_url}/horarios/${id}`;
    return this.http.put<crudHorario>(base, horario, this.headers);
  }
  borrar(id: number) {
    const base = `${base_url}/horarios/${id}`;
    return this.http.delete<crudHorario>(base, this.headers);
  }
  buscarHorario(termino: string) {
    const base = `${base_url}/horarios/busqueda/${termino}`;
    return this.http.get<any[]>(base, this.headers)
      .pipe(
        map((resp: any) => {
          return this.transformar(resp.busquedas)
        })
      );
  }

  private transformar(busquedas: any[]): Horario[] {
    return busquedas.map(
      horario => new Horario(horario.dia, horario.horaId, horario.programacionId, horario.hora, horario.programacion, horario.id)
    );
  }

  existeHorario(periodoId:number,aulaId:number,diaNombre:string,horaId:number){
    const base = `${base_url}/horarios/existehorario/${periodoId}/${aulaId}/${diaNombre}/${horaId}`;
    return this.http.get<crudHorario>(base, this.headers);
  }

  hayHorarioPeriodoAula(periodoId:number,aulaId:number){
    const base = `${base_url}/horarios/hayhorario/${periodoId}/${aulaId}`;
    return this.http.get<listarHorarios>(base, this.headers);
  }

  horarioDuplicado(periodoId:number,aulaId:number, subareaId:number,dia:string,horaId:number){
    const base = `${base_url}/horarios/horarioduplicado/${periodoId}/${aulaId}/${subareaId}/${dia}/${horaId}`;
    return this.http.get<crudHorario>(base, this.headers);
  }

  horariosPeriodoAula(periodoId:number,aulaId:number){
    const base = `${base_url}/horarios/periodoaula/${periodoId}/${aulaId}`;
    return this.http.get<listarHorarios>(base, this.headers);
  }

  horariosPeriododDocente(periodoId:number,docenteId:number){
    const base = `${base_url}/horarios/periododocente/${periodoId}/${docenteId}`;
    return this.http.get<listarHorarios>(base, this.headers);
  }

}
