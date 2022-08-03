import { Hora } from "../models/hora.model";

export interface listarHoras {
    ok: boolean,
    horas: Hora[];
    desde: number,
    total: number,
}

export interface crudHora {
    ok: boolean,
    msg: string,
    hora: Hora
}