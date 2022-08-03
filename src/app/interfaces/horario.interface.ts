import { Horario } from "../models/horario.model";

export interface listarHorarios {
    ok: boolean,
    horarios: Horario[];
    desde: number,
    total: number,
}

export interface crudHorario {
    ok: boolean,
    msg: string,
    horario: Horario
}