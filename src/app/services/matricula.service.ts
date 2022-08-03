import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { crudMatricula, listarMatriculas } from '../interfaces/matricula.interface';
import { Matricula } from '../models/matricula.model';

const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {

  constructor(private http:HttpClient) { }

  get token():string{
    return localStorage.getItem('token') || '';
  }
  get headers(){
    return {
      headers:{
        'x-token':this.token
      }
    }
  }

  listar(desde:number=0){
    const url=`${base_url}/matriculas?desde=${desde}`;
    return this.http.get<listarMatriculas>(url,this.headers);
  }
  obtener(id:number){
    const url=`${base_url}/matriculas/${id}`;
    return this.http.get<crudMatricula>(url,this.headers);
  }
  crear(matricula:Matricula){
    const base= `${base_url}/matriculas`;
    return this.http.post<crudMatricula>(base,matricula, this.headers);
  }
  actualizar(id:number, matricula:Matricula){
    const base= `${base_url}/matriculas/${id}`;
    return this.http.put<crudMatricula>(base,matricula,this.headers);
  }
  borrar(id:number){
    const base= `${base_url}/matriculas/${id}`;
    return this.http.delete<crudMatricula>(base,this.headers);
  }
  buscarPorAlumno(nombre:string){
    const base= `${base_url}/matriculas/busqueda/${nombre}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    )
  }
  buscarPorAlumnoSubarea(nombre:string, subareaId:number){
    const base= `${base_url}/matriculas/busqueda/subarea/${subareaId}/${nombre}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    )
  }
  private transformar(busquedas:any[]):Matricula[]{
    return busquedas.map(
      matricula=>new Matricula(matricula.alumnoId,matricula.programacionId,matricula.nota,
      matricula.alumno,matricula.programacion,matricula.id)
    );
  }
  existeMatricula(periodo:number,aula:number,alumno:number){
    const base= `${base_url}/matriculas/existe/${periodo}/${aula}/${alumno}`;
    return this.http.get<crudMatricula>(base,this.headers);
  }
  matriculasPorProgramacion(programacionId:number){
    const base=`${base_url}/matriculas/programacion/${programacionId}`;
    return this.http.get<listarMatriculas>(base,this.headers);
  }

  matriculasPorProgramacionRangoFechas(programacionId:number, fechainicial:string){
    const base=`${base_url}/matriculas/programacion/fecha/${programacionId}/${fechainicial}`;
    return this.http.get<listarMatriculas>(base,this.headers);
  }

  matriculasPorAlumno(alumnoId:number,desde:number=0){
    const base= `${base_url}/matriculas/alumno/${alumnoId}?desde=${desde}`;
    return this.http.get<listarMatriculas>(base, this.headers);
  }

  matriculasPorAlumnoReporte(alumnoId:number){
    const base= `${base_url}/matriculas/alumnoreporte/${alumnoId}`;
    return this.http.get<listarMatriculas>(base, this.headers);
  }

  matriculasPorAlumnoPeriodo(alumnoId:number,periodoId:number,desde:number=0){
    const base= `${base_url}/matriculas/alumnoperiodo/${alumnoId}/${periodoId}?desde=${desde}`;
    return this.http.get<listarMatriculas>(base, this.headers);
  }

  perteneceMatriculaAlumno(matriculaId:number,alumnoId:number){
    const base= `${base_url}/matriculas/pertenece/${matriculaId}/${alumnoId}`;
    return this.http.get<crudMatricula>(base,this.headers);
  }
  perteneceProgramacionAlumno(programacionId:number,alumnoId:number){
    const base= `${base_url}/matriculas/pertenece/programacion/${programacionId}/${alumnoId}`;
    return this.http.get<crudMatricula>(base,this.headers);
  }

  perteneceMatriculaApoderado(apoderadoId:number, matriculaId:number){
    const base= `${base_url}/matriculas/pertenece/apoderado/${apoderadoId}/${matriculaId}`;
    return this.http.get<crudMatricula>(base,this.headers);
  }

  matriculasProgramacionCiclo(programacionId:number,cicloId:number){
    const base= `${base_url}/matriculas/programacion/ciclo/${programacionId}/${cicloId}`;
    return this.http.get<listarMatriculas>(base,this.headers);
  }

  matriculasAlumnoPorApoderado(apoderadoId:number,desde:number=0){
    const base= `${base_url}/matriculas/alumno/apoderado/${apoderadoId}?desde=${desde}`;
    return this.http.get<listarMatriculas>(base,this.headers);
  }
  matriculasAlumnoPorApoderadoPeriodo(apoderadoId:number,periodoId:number,desde:number=0){
    const base= `${base_url}/matriculas/alumno/apoderadoperiodo/${apoderadoId}/${periodoId}/?desde=${desde}`;
    return this.http.get<listarMatriculas>(base,this.headers);
  }
  matriculasApoderado(apoderadoId:number){
    const base= `${base_url}/matriculas/alumno/apoderado/reporte/${apoderadoId}`;
    return this.http.get<listarMatriculas>(base,this.headers);
  }

  
  matriculasApoderadoPeriodoAula(apoderadoId:number, periodoId:number,aulaId:number){
    const base= `${base_url}/matriculas/apoderado/parahorario/${apoderadoId}/${periodoId}/${aulaId}`;
    return this.http.get<listarMatriculas>(base,this.headers);
  }



  matriculasPeriodoAulaSubareaCiclo(periodoId:number,aulaId:number,subareaId:number,cicloId:number){
    const base= `${base_url}/matriculas/obtenermatriculas/${periodoId}/${aulaId}/${subareaId}/${cicloId}`;
    return this.http.get<listarMatriculas>(base,this.headers);
  }
  matriculasPeriodoAulaSubareaCicloApoderado(periodoId:number,aulaId:number,subareaId:number,cicloId:number,apoderadoId:number){
    const base= `${base_url}/matriculas/obtenermatriculasapoderado/${periodoId}/${aulaId}/${subareaId}/${cicloId}/${apoderadoId}`;
    return this.http.get<listarMatriculas>(base,this.headers);
  }
  obtenerMatriculaCiclo(matriculaId:number,cicloId:number){
    const base= `${base_url}/matriculas/obtenermatriculaalumno/${matriculaId}/${cicloId}`;
    return this.http.get<crudMatricula>(base,this.headers);
  }

  obtenerMatriculaAnual(matriculaId:number){
    const base= `${base_url}/matriculas/obtenermatriculaalumnoanual/${matriculaId}`;
    return this.http.get<crudMatricula>(base,this.headers);
  }

  matriculasPeriodoAulaSubarea(periodoId:number,aulaId:number,subareaId:number){
    const base= `${base_url}/matriculas/listamatriculas/${periodoId}/${aulaId}/${subareaId}`;
    return this.http.get<listarMatriculas>(base,this.headers);
  }
  matriculasPeriodoAulaSubareaApoderado(periodoId:number,aulaId:number,subareaId:number,apoderadoId:number){
    const base= `${base_url}/matriculas/listamatriculasapoderado/${periodoId}/${aulaId}/${subareaId}/${apoderadoId}`;
    return this.http.get<listarMatriculas>(base,this.headers);
  }




  matriculasPeriodoAulaArea(periodoId:number,aulaId:number,areaId:number){
    const base= `${base_url}/matriculas/listamatriculasarea/${periodoId}/${aulaId}/${areaId}`;
    return this.http.get<listarMatriculas>(base,this.headers);
  }

  matriculasPeriodoAulaApoderadoArea(periodoId:number,aulaId:number,areaId:number,apoderadoId:number){
    const base= `${base_url}/matriculas/listamatriculasapoderadoarea/${periodoId}/${aulaId}/${areaId}/${apoderadoId}`;
    return this.http.get<listarMatriculas>(base,this.headers);
  }
  


  buscarMatriculasApoderadoPorAlumno(nombre:string,apoderadoId:number){
    const base= `${base_url}/matriculas/busquedaapoderado/${apoderadoId}/${nombre}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    )
  }
  buscarMatriculasApoderadoPorAlumnoPeriodo(nombre:string,apoderadoId:number,periodoId:number){
    const base= `${base_url}/matriculas/busquedaapoderadoperiodo/${apoderadoId}/${periodoId}/${nombre}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    )
  }
  buscarMatriculasPorAlumno(aulanombre:string,alumnoId:number){
    const base= `${base_url}/matriculas/busquedaalumno/${alumnoId}/${aulanombre}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    )
  }
  buscarMatriculasPorAlumnoPeriodo(aulanombre:string,alumnoId:number,periodoId:number){
    const base= `${base_url}/matriculas/busquedaalumnoperiodo/${alumnoId}/${periodoId}/${aulanombre}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    )
  }
  matriculasAnual(periodoId:number,aulaId:number,subareaId:number){
    const base= `${base_url}/matriculas/anual/${periodoId}/${aulaId}/${subareaId}`;
    return this.http.get<listarMatriculas>(base,this.headers);
  }
  matriculasAnualApoderado(periodoId:number,aulaId:number,subareaId:number,apoderadoId:number){
    const base= `${base_url}/matriculas/anualapoderado/${periodoId}/${aulaId}/${subareaId}/${apoderadoId}`;
    return this.http.get<listarMatriculas>(base,this.headers);
  }
  matriculasPorSubarea(desde:number=0,subareaId:number){
    const url=`${base_url}/matriculas/subarea/${subareaId}?desde=${desde}`;
    return this.http.get<listarMatriculas>(url,this.headers);
  }
}
