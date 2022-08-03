import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { crudAsistencia } from '../interfaces/asistencia.interface';
import { Asistencia } from '../models/asistencia.model';
import { listarAsistencias } from '../interfaces/asistencia.interface';

const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

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
    const base= `${base_url}/asistencias?desde=${desde}`;
    return this.http.get<listarAsistencias>(base, this.headers);
  }
  obtener(id:number){
    const url=`${base_url}/asistencias/${id}`;
    return this.http.get<crudAsistencia>(url,this.headers);
  }

  crear(asistencia:Asistencia){
    const base= `${base_url}/asistencias`;
    return this.http.post<crudAsistencia>(base,asistencia, this.headers);
  }

  actualizar(id:number, asistencia:Asistencia){
    const base= `${base_url}/asistencias/${id}`;
    return this.http.put<crudAsistencia>(base,asistencia,this.headers);
  }
  borrar(id:number){
    const base= `${base_url}/asistencias/${id}`;
    return this.http.delete<crudAsistencia>(base,this.headers);
  }

  asistenciasProgramacionFecha(programacionId:number,fecha:string){
    const base=`${base_url}/asistencias/programacion/fecha/${programacionId}/${fecha}`
    return this.http.get<listarAsistencias>(base,this.headers);
  }

  asistenciasPorMatricula(matriculaId:number, fechainicial:string){
    const base=`${base_url}/asistencias/matricula/fecha/${matriculaId}/${fechainicial}`
    return this.http.get<listarAsistencias>(base,this.headers);
  }

  existeAsistenciaProgramacionFecha(programacionId:number,fecha:string){
    const base=`${base_url}/asistencias/asistencia/existe/${programacionId}/${fecha}`
    return this.http.get<crudAsistencia>(base,this.headers);
  }

  asistenciasPeriodoAulaSubareaFecha(periodoId:number,aulaId:number,subareaId:number,fecha:number){
    const base=`${base_url}/asistencias/obtenerasistencias/${periodoId}/${aulaId}/${subareaId}/${fecha}`;
    return this.http.get<listarAsistencias>(base,this.headers);
  }

  asistenciasPeriodoAulaSubareaFechaApoderado(periodoId:number,aulaId:number,subareaId:number,fecha:number,apoderadoId:number){
    const base=`${base_url}/asistencias/obtenerasistenciasapoderado/${periodoId}/${aulaId}/${subareaId}/${fecha}/${apoderadoId}`;
    return this.http.get<listarAsistencias>(base,this.headers);
  }

  asistenciasPorMatriculaRango(matriculaId:number, fechainicial:string,fechafinal:string){
    const base=`${base_url}/asistencias/matricula/rangofecha/${matriculaId}/${fechainicial}/${fechafinal}`
    return this.http.get<listarAsistencias>(base,this.headers);
  }

  asistenciasRango(periodoId:number,aulaId:number,subareaId:number,fechainicial:string,fechafinal:string){
    const base=`${base_url}/asistencias/rango/${periodoId}/${aulaId}/${subareaId}/${fechainicial}/${fechafinal}`;
    return this.http.get<listarAsistencias>(base,this.headers);
  }

  asistenciasRangoApoderado(periodoId:number,aulaId:number,subareaId:number,fechainicial:string,fechafinal:string,apoderadoId:number){
    const base=`${base_url}/asistencias/rangoapoderado/${periodoId}/${aulaId}/${subareaId}/${fechainicial}/${fechafinal}/${apoderadoId}`;
    return this.http.get<listarAsistencias>(base,this.headers);
  }

  asistenciasRangoMatricula(periodoId:number,aulaId:number,subareaId:number,matriculaId:number,fechainicial:string,fechafinal:string){
    const base=`${base_url}/asistencias/rangomatricula/${periodoId}/${aulaId}/${subareaId}/${matriculaId}/${fechainicial}/${fechafinal}`;
    return this.http.get<listarAsistencias>(base,this.headers);
  }

}
