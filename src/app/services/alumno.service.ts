import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { crudAlumno, listarAlumnos } from '../interfaces/alumno.interface';
import { Alumno } from '../models/alumno.model';

const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

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

  todo(){
    const base= `${base_url}/alumnos/filtrado/todo`;
    return this.http.get<listarAlumnos>(base, this.headers);
  }
  listar(desde:number=0){
    const base= `${base_url}/alumnos?desde=${desde}`;
    return this.http.get<listarAlumnos>(base, this.headers);
  }
  obtener(id:number){
    const url=`${base_url}/alumnos/${id}`;
    return this.http.get<crudAlumno>(url,this.headers);
  }
  crear(alumno:Alumno){
    const base= `${base_url}/alumnos`;
    return this.http.post<crudAlumno>(base,alumno, this.headers);
  }
  actualizar(id:number, alumno:Alumno){
    const base= `${base_url}/alumnos/${id}`;
    return this.http.put<crudAlumno>(base,alumno,this.headers);
  }
  borrar(id:number){
    const base= `${base_url}/alumnos/${id}`;
    return this.http.delete<crudAlumno>(base,this.headers);
  }
  searchDNI(dni: string){
    const base = `${base_url}/alumnos/searchdni/${dni}`;
    return this.http.get<crudAlumno>(base, this.headers);
  }

  buscar(termino: string){
    const base=`${base_url}/alumnos/busqueda/${termino}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    );
  }


  porNumero(numero:string){
    const base= `${base_url}/alumnos/alumno/${numero}`;
    return this.http.get<crudAlumno>(base,this.headers);
  }

  buscarPorNombre(termino:string){
    const base=`${base_url}/alumnos/busqueda/${termino}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    );
  }

  buscarPorApellido(termino:string){
    const base=`${base_url}/alumnos/busqueda/apellido/${termino}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    );
  }

  buscarPorDocumento(termino:string){
    const base=`${base_url}/alumnos/busqueda/documento/${termino}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    );
  }

  buscarPorNombres(termino:string){
    const base=`${base_url}/alumnos/busqueda/nombres/${termino}`;
    return this.http.get<any[]>(base,this.headers)
    .pipe(
      map((resp:any)=>{
        return this.transformar(resp.busquedas)
      })
    );
  }

  private transformar(busquedas:any[]):Alumno[]{
    return busquedas.map(
      alumno=>new Alumno(alumno.personaId,alumno.padreId,alumno.madreId,alumno.vivecon,alumno.tienediscapacidad,alumno.cualdiscapacidad,alumno.certificadiscapacidad,alumno.observacion,alumno.persona,alumno.padre,alumno.madre,alumno.id)
    );
  }
  tieneMatricula(alumnoId:number){
    const base=`${base_url}/alumnos/tienematricula/${alumnoId}`;
    return this.http.get<crudAlumno>(base,this.headers);
  }

  listaAlumnosPorPadre(padreId:number){
    const base= `${base_url}/alumnos/padre/${padreId}`;
    return this.http.get<listarAlumnos>(base, this.headers);
  }

  listaAlumnosPorMadre(madreId:number){
    const base= `${base_url}/alumnos/madre/${madreId}`;
    return this.http.get<listarAlumnos>(base, this.headers);
  }

}
