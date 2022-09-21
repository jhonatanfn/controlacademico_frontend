import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { crudMatriculadetalle, listarMatriculadetalles } from '../interfaces/matriculadetalle';
import { Matriculadetalle } from '../models/matriculadetalle';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MatriculadetalleService {

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
    const url = `${base_url}/matriculadetalles?desde=${desde}`;
    return this.http.get<listarMatriculadetalles>(url, this.headers);
  }
  obtener(id: number) {
    const url = `${base_url}/matriculadetalles/${id}`;
    return this.http.get<crudMatriculadetalle>(url, this.headers);
  }
  crear(matriculadetalle: Matriculadetalle) {
    const base = `${base_url}/matriculadetalles`;
    return this.http.post<crudMatriculadetalle>(base, matriculadetalle, this.headers);
  }
  actualizar(id: number, matriculadetalle: Matriculadetalle) {
    const base = `${base_url}/matriculadetalles/${id}`;
    return this.http.put<crudMatriculadetalle>(base, matriculadetalle, this.headers);
  }
  borrar(id: number) {
    const base = `${base_url}/matriculadetalles/${id}`;
    return this.http.delete<crudMatriculadetalle>(base, this.headers);
  }
  busqueda(nombre: string) {
    const base = `${base_url}/matriculadetalles/busqueda/${nombre}`;
    return this.http.get<any[]>(base, this.headers)
      .pipe(
        map((resp: any) => {
          return this.transformar(resp.busquedas)
        })
      )
  }

  listadoAlumnos(periodoId: number, aulaId: number) {
    const url = `${base_url}/matriculadetalles/listado/${periodoId}/${aulaId}`;
    return this.http.get<listarMatriculadetalles>(url, this.headers);
  }
  listadoAlumnosProgramacion(programacionId: number) {
    const url = `${base_url}/matriculadetalles/listadoalumnos/${programacionId}`;
    return this.http.get<listarMatriculadetalles>(url, this.headers);
  }
  matriculadetallesPorAlumno(alumnoId: number, desde: number = 0) {
    const base = `${base_url}/matriculadetalles/alumno/${alumnoId}?desde=${desde}`;
    return this.http.get<listarMatriculadetalles>(base, this.headers);
  }

  matriculadetallesPorAlumnoPeriodo(alumnoId: number, periodoId: number, desde: number = 0) {
    const base = `${base_url}/matriculadetalles/alumnoperiodo/${alumnoId}/${periodoId}?desde=${desde}`;
    return this.http.get<listarMatriculadetalles>(base, this.headers);
  }
  buscarMatriculadetallesPorAlumnoPeriodo(aulanombre: string, alumnoId: number, periodoId: number) {
    const base = `${base_url}/matriculadetalles/busquedaalumnoperiodo/${alumnoId}/${periodoId}/${aulanombre}`;
    return this.http.get<any[]>(base, this.headers)
      .pipe(
        map((resp: any) => {
          return this.transformar(resp.busquedas)
        })
      )
  }
  buscarMatriculadetallesPorAlumno(aulanombre: string, alumnoId: number) {
    const base = `${base_url}/matriculadetalles/busquedaalumno/${alumnoId}/${aulanombre}`;
    return this.http.get<any[]>(base, this.headers)
      .pipe(
        map((resp: any) => {
          return this.transformar(resp.busquedas)
        })
      )
  }
  perteneceMatriculadetalleAlumno(matriculadetalleId:number,alumnoId:number){
    const base= `${base_url}/matriculadetalles/pertenece/${matriculadetalleId}/${alumnoId}`;
    return this.http.get<crudMatriculadetalle>(base,this.headers);
  }
  existeMatriculadetalle(periodo: number, aula: number, alumno: number) {
    const base = `${base_url}/matriculadetalles/existe/${periodo}/${aula}/${alumno}`;
    return this.http.get<crudMatriculadetalle>(base, this.headers);
  }
  listarmatriculadetallesAnterior(alumnoId: number) {
    const url = `${base_url}/matriculadetalles/periodoanterior/${alumnoId}`;
    return this.http.get<listarMatriculadetalles>(url, this.headers);
  }
  aprobadoAlumno(alumnoId: number) {
    const url = `${base_url}/matriculadetalles/aprobado/${alumnoId}`;
    return this.http.get<crudMatriculadetalle>(url, this.headers);
  }
  matriculadetalles(matriculaId: number) {
    const url = `${base_url}/matriculadetalles/matricula/${matriculaId}`;
    return this.http.get<listarMatriculadetalles>(url, this.headers);
  }
  matriculadetallesProgramacion(programacionId: number) {
    const base = `${base_url}/matriculadetalles/programacion/${programacionId}`;
    return this.http.get<listarMatriculadetalles>(base, this.headers);
  }
  perteneceProgramacionAlumno(programacionId:number,alumnoId:number){
    const base= `${base_url}/matriculadetalles/pertenece/programacion/${programacionId}/${alumnoId}`;
    return this.http.get<crudMatriculadetalle>(base,this.headers);
  }
  matriculadetallesAlumnoPorPadrePeriodo(padreId:number,periodoId:number,desde:number=0){
    const base= `${base_url}/matriculadetalles/alumno/padreperiodo/${padreId}/${periodoId}/?desde=${desde}`;
    return this.http.get<listarMatriculadetalles>(base,this.headers);
  }
  matriculadetallesAlumnoPorPadre(padreId:number,desde:number=0){
    const base= `${base_url}/matriculadetalles/alumno/padre/${padreId}?desde=${desde}`;
    return this.http.get<listarMatriculadetalles>(base,this.headers);
  }

  buscarMatriculadetallesPadrePorAlumnoPeriodo(nombre:string,padreId:number,periodoId:number){
    const base= `${base_url}/matriculadetalles/busquedapadreperiodo/${padreId}/${periodoId}/${nombre}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    )
  }
  buscarMatriculadetallesPadrePorAlumno(nombre:string,padreId:number){
    const base= `${base_url}/matriculadetalles/busquedapadre/${padreId}/${nombre}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    )
  }
  private transformar(busquedas: any[]): Matriculadetalle[] {
    return busquedas.map(
      mt => new Matriculadetalle(mt.programacionId, mt.matriculaId, mt.programacion, mt.matricula, mt.id)
    );
  }
  perteneceMatriculadetallePadre(padreId:number, matriculaId:number){
    const base= `${base_url}/matriculadetalles/pertenece/padre/${padreId}/${matriculaId}`;
    return this.http.get<crudMatriculadetalle>(base,this.headers);
  }
  matriculadetallesAlumnoPorMadrePeriodo(madreId:number,periodoId:number,desde:number=0){
    const base= `${base_url}/matriculadetalles/alumno/madreperiodo/${madreId}/${periodoId}/?desde=${desde}`;
    return this.http.get<listarMatriculadetalles>(base,this.headers);
  }
  matriculadetallesAlumnoPorMadre(madreId:number,desde:number=0){
    const base= `${base_url}/matriculadetalles/alumno/madre/${madreId}?desde=${desde}`;
    return this.http.get<listarMatriculadetalles>(base,this.headers);
  }
  buscarMatriculadetallesMadrePorAlumnoPeriodo(nombre:string,madreId:number,periodoId:number){
    const base= `${base_url}/matriculadetalles/busquedamadreperiodo/${madreId}/${periodoId}/${nombre}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    )
  }
  buscarMatriculadetallesMadrePorAlumno(nombre:string,madreId:number){
    const base= `${base_url}/matriculadetalles/busquedamadre/${madreId}/${nombre}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    )
  }
  perteneceMatriculadetalleMadre(madreId:number, matriculaId:number){
    const base= `${base_url}/matriculadetalles/pertenece/madre/${madreId}/${matriculaId}`;
    return this.http.get<crudMatriculadetalle>(base,this.headers);
  }
  matriculadetallesPeriodoAula(periodoId:number, aulaId:number){
    const base= `${base_url}/matriculadetalles/periodoaula/${periodoId}/${aulaId}`;
    return this.http.get<listarMatriculadetalles>(base,this.headers);
  }
  matriculadetallesPeriodoAulaArea(periodoId:number, aulaId:number, areaId:number){
    const base= `${base_url}/matriculadetalles/periodoaulaarea/${periodoId}/${aulaId}/${areaId}`;
    return this.http.get<listarMatriculadetalles>(base,this.headers);
  }

}
