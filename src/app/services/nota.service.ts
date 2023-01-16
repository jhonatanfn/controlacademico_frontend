import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { crudNota, listarNotas } from '../interfaces/nota.interface';
import { Nota } from '../models/nota.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class NotaService {

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
    const url = `${base_url}/notas?desde=${desde}`;
    return this.http.get<listarNotas>(url, this.headers);
  }
  obtener(id: number) {
    const url = `${base_url}/notas/${id}`;
    return this.http.get<crudNota>(url, this.headers);
  }
  crear(nota: Nota) {
    const base = `${base_url}/notas`;
    return this.http.post<crudNota>(base, nota, this.headers);
  }
  actualizar(id: number, nota: Nota) {
    const base = `${base_url}/notas/${id}`;
    return this.http.put<crudNota>(base, nota, this.headers);
  }
  borrar(id: number) {
    const base = `${base_url}/notas/${id}`;
    return this.http.delete<crudNota>(base, this.headers);
  }
  notasProgramacionFechaEvaluacionCiclo(programacionId: number, fecha: string, evaluacionId: number, cicloId: number) {
    const base = `${base_url}/notas/programacion/fecha/evaluacion/ciclo/${programacionId}/${fecha}/${evaluacionId}/${cicloId}`
    return this.http.get<listarNotas>(base, this.headers);
  }
  notasProgramacionFechaEvaluacionCicloCompetencia(programacionId: number, fecha: string, 
  evaluacionId: number, cicloId: number, competenciaId:number) {
    const base = `${base_url}/notas/programacion/fecha/evaluacion/ciclo/competencia/${programacionId}/${fecha}/${evaluacionId}/${cicloId}/${competenciaId}`
    return this.http.get<listarNotas>(base, this.headers);
  }
  notasMatriculaCicloEvaluacion(matriculaId: number, cicloId: number, evaluacionId: number) {
    const base = `${base_url}/notas/${matriculaId}/${cicloId}/${evaluacionId}`;
    return this.http.get<listarNotas>(base, this.headers);
  }
  notasArea(periodoId:number,aulaId:number,areaId:number,cicloId:number,alumnoId:number) {
    const base = `${base_url}/notas/area/${periodoId}/${aulaId}/${areaId}/${cicloId}/${alumnoId}`;
    return this.http.get<listarNotas>(base, this.headers);
  }
  notasPeriodo(periodoId:number){
    const base = `${base_url}/notas/porperiodo/${periodoId}`;
    return this.http.get<listarNotas>(base, this.headers);
  }
  notasPeriodoAula(periodoId:number, aulaId:number){
    const base = `${base_url}/notas/reportedos/porperiodoaula/${periodoId}/${aulaId}`;
    return this.http.get<listarNotas>(base, this.headers);
  }
  notasPeriodoAulaArea(periodoId:number, aulaId:number,areaId:number){
    const base = `${base_url}/notas/reportetres/porperiodoaulaarea/${periodoId}/${aulaId}/${areaId}`;
    return this.http.get<listarNotas>(base, this.headers);
  }
  notasPeriodoAulaAreaSubarea(periodoId:number, aulaId:number,areaId:number, subareaId:number){
    const base = `${base_url}/notas/porperiodoaulaareasubarea/${periodoId}/${aulaId}/${areaId}/${subareaId}`;
    return this.http.get<listarNotas>(base, this.headers);
  }
  notasPeriodoAulaAreaCiclo(periodoId:number, aulaId:number,areaId:number, cicloId:number){
    const base = `${base_url}/notas/porperiodoaulaareaciclo/${periodoId}/${aulaId}/${areaId}/${cicloId}`;
    return this.http.get<listarNotas>(base, this.headers);
  }
  notasPeriodoAulaAreaCicloAlumno(periodoId:number, aulaId:number,areaId:number,cicloId:number,alumnoId:number){
    const base = `${base_url}/notas/porperiodoaulaareacicloalumno/${periodoId}/${aulaId}/${areaId}/${cicloId}/${alumnoId}`;
    return this.http.get<listarNotas>(base, this.headers);
  }
  notasHoyLiteral(periodoId:number, fecha:string){
    const base = `${base_url}/notas/parahoynotasliteral/${periodoId}/${fecha}`;
    return this.http.get<listarNotas>(base, this.headers);
  }
  notasHoyVigesimal(periodoId:number, fecha:string){
    const base = `${base_url}/notas/parahoynotasvigesimal/${periodoId}/${fecha}`;
    return this.http.get<listarNotas>(base, this.headers);
  }
  buscarPorSubarea(termino:string){
    const base=`${base_url}/notas/busqueda/${termino}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    );
  }
  private transformar(busquedas:any[]):Nota[]{
    return busquedas.map(
      nota=>new Nota(nota.matriculaId,nota.evaluacionId,nota.cicloId,nota.valor,nota.fecha)
    );
  }
  notasPeriodoAulaCicloAlumno(periodoId:number, aulaId:number, cicloId:number, alumnoId:number){
    const base = `${base_url}/notas/reportealumno/${periodoId}/${aulaId}/${cicloId}/${alumnoId}`;
    return this.http.get<listarNotas>(base, this.headers);
  }
  notasPeriodoAulaAlumno(periodoId:number, aulaId:number, alumnoId:number){
    const base = `${base_url}/notas/notasperiodoaulaalumno/${periodoId}/${aulaId}/${alumnoId}`;
    return this.http.get<listarNotas>(base, this.headers);
  }
  notasCicloMatriculadetalle(cicloId:number, matriculadetalleId:number){
    const base = `${base_url}/notas/ciclo/matriculadetalle/${cicloId}/${matriculadetalleId}`;
    return this.http.get<listarNotas>(base, this.headers);
  }
  cambiarEstado(id: number, nota:Nota){
    const url = `${base_url}/notas/cambiarestado/${id}`;
    return this.http.put<crudNota>(url, nota, this.headers);
  }
  existeNotasMatricula(matriculaId:number){
    const base = `${base_url}/notas/existenotas/${matriculaId}`;
    return this.http.get<listarNotas>(base, this.headers);
  }

}
