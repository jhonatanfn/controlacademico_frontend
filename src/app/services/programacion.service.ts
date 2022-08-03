import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { crudProgramacion, listarProgramacion } from '../interfaces/programacion.interface';
import { Programacion } from '../models/programacion.model';

const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ProgramacionService {

  constructor(private http:HttpClient) {}

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
    const base= `${base_url}/programaciones?desde=${desde}`;
    return this.http.get<listarProgramacion>(base, this.headers);
  }
  obtener(id:number){
    const url=`${base_url}/programaciones/${id}`;
    return this.http.get<crudProgramacion>(url,this.headers);
  }
  crear(programacion:Programacion){
    const base= `${base_url}/programaciones`;
    return this.http.post<crudProgramacion>(base,programacion, this.headers);
  }
  actualizar(id:number, programacion:Programacion){
    const base= `${base_url}/programaciones/${id}`;
    return this.http.put<crudProgramacion>(base,programacion,this.headers);
  }
  borrar(id:number){
    const base= `${base_url}/programaciones/${id}`;
    return this.http.delete<crudProgramacion>(base,this.headers);
  }
  porPeriodoAula(periodoid:number,aulaid:number){
    const base= `${base_url}/programaciones/periodo/aula/${periodoid}/${aulaid}`;
    return this.http.get<listarProgramacion>(base,this.headers);
  }

  porPeriodo(periodoId:number){
    const base= `${base_url}/programaciones/periodo/${periodoId}`;
    return this.http.get<listarProgramacion>(base,this.headers);
  }

  porPeriodoPaginado(periodoId:number,desde:number=0){
    const base= `${base_url}/programaciones/periodopaginado/${periodoId}?desde=${desde}`;
    return this.http.get<listarProgramacion>(base,this.headers);
  }

  buscarPorAula(nombre:string){
    const base=`${base_url}/programaciones/busqueda/${nombre}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    )
  }

  buscarPorDocente(nombre:string){
    const base=`${base_url}/programaciones/busqueda/docente/${nombre}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    )
  }

  buscarPorsubarea(nombre:string){
    const base=`${base_url}/programaciones/busqueda/subarea/${nombre}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    )
  }

  private transformar(busquedas:any[]):Programacion[]{
    return busquedas.map(
      prog=>new Programacion(prog.periodoid,prog.aulaId,prog.subareaId,prog.docenteId,
      prog.periodo,prog.aula,prog.subarea,prog.docente,prog.numeromat,prog.numeromaxmat,prog.id)
    );
  }

  existeProgramacion(periodo:number,aula:number,subarea:number){
    const base=`${base_url}/programaciones/existe/${periodo}/${aula}/${subarea}`;
    return this.http.get<crudProgramacion>(base, this.headers);
  }

  programacionesPorDocente(docenteId:number,desde:number=0){
    const base=`${base_url}/programaciones/docente/${docenteId}?desde=${desde}`;
    return this.http.get<listarProgramacion>(base, this.headers);
  }
  programacionesPorDocentePeriodo(docenteId:number,periodoId:number){
    const base=`${base_url}/programaciones/docente/periodo/${docenteId}/${periodoId}`;
    return this.http.get<listarProgramacion>(base,this.headers);
  }

  programacionesPorDocentePeriodoPaginado(docenteId:number,periodoId:number, desde:number=0){
    const base=`${base_url}/programaciones/docente/periodopaginado/${docenteId}/${periodoId}?desde=${desde}`;
    return this.http.get<listarProgramacion>(base,this.headers);
  }

  perteneceProgramacionDocente(programacionId:number, docenteId:number){
    const base=`${base_url}/programaciones/pertenece/${programacionId}/${docenteId}`;
    return this.http.get<crudProgramacion>(base, this.headers);
  }

  buscarProgramacionesDocente(nombre:string,docenteId:number){
    const base=`${base_url}/programaciones/busqueda/pordocente/${docenteId}/${nombre}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    )
  }
  buscarProgramacionesDocentePeriodo(nombre:string,docenteId:number,periodoId:number){
    const base=`${base_url}/programaciones/busqueda/pordocenteperiodo/${docenteId}/${periodoId}/${nombre}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    )
  }

  buscarProgramacionesPeriodo(nombre:string,periodoId:number){
    const base=`${base_url}/programaciones/busqueda/administradorperiodo/${periodoId}/${nombre}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    )
  }

  buscarProgramaciones(nombre:string){
    const base=`${base_url}/programaciones/busqueda/administrador/${nombre}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    )
  }

  
}
