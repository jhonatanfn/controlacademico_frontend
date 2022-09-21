import { Matriculadetalle } from "../models/matriculadetalle";

export interface listarMatriculadetalles {
    ok: boolean,
    msg: string,
    matriculadetalles: Matriculadetalle[];
    desde: number,
    total: number
}

export interface crudMatriculadetalle {
    ok: boolean,
    msg: string,
    matriculadetalle: Matriculadetalle,
}