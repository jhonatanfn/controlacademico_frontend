import { Alumno } from "../models/alumno.model";

export interface listarAlumnos{
    ok:boolean,
    alumnos:Alumno[];
    desde:number,
    total:number,
}

export interface crudAlumno{
    ok:boolean,
    msg:string,
    alumno:Alumno,
}