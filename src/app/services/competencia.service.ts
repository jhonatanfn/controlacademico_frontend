import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { crudCompetencia, listarCompetencia } from '../interfaces/competencia.interface';
import { Competencia } from '../models/competencia.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CompetenciaService {

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
    const base = `${base_url}/competencias/todo`;
    return this.http.get<listarCompetencia>(base, this.headers);
  }
  listar(desde: number = 0) {
    const base = `${base_url}/competencias?desde=${desde}`;
    return this.http.get<listarCompetencia>(base, this.headers);
  }
  obtener(id: number) {
    const url = `${base_url}/competencias/${id}`;
    return this.http.get<crudCompetencia>(url, this.headers);
  }
  crear(competencia: Competencia) {
    const base = `${base_url}/competencias`;
    return this.http.post<crudCompetencia>(base, competencia, this.headers);
  }
  actualizar(id: number, competencia: Competencia) {
    const base = `${base_url}/competencias/${id}`;
    return this.http.put<crudCompetencia>(base, competencia, this.headers);
  }
  borrar(id: number) {
    const base = `${base_url}/competencias/${id}`;
    return this.http.delete<crudCompetencia>(base, this.headers);
  }
  competenciasArea(areaId:Number){
    const base= `${base_url}/competencias/porcompetencia/${areaId}`;
    return this.http.get<listarCompetencia>(base, this.headers);
  }
  busqueda(termino: string) {
    const base = `${base_url}/competencias/busqueda/${termino}`;
    return this.http.get<any[]>(base, this.headers)
      .pipe(
        map((resp: any) => {
          return this.transformar(resp.busquedas)
        })
      );
  }
  private transformar(busquedas: any[]): Competencia[] {
    return busquedas.map(
      competencia => new Competencia(competencia.descripcion,competencia.areId,competencia.area,competencia.estado, competencia.id)
    );
  }

  tieneArea(competenciaId:number){
    const base= `${base_url}/competencias/tienearea/${competenciaId}`;
    return this.http.get<crudCompetencia>(base,this.headers);
  }
  existenNotas(competenciaId:number){
    const base= `${base_url}/competencias/existenotas/${competenciaId}`;
    return this.http.get<crudCompetencia>(base,this.headers);
  }
}
