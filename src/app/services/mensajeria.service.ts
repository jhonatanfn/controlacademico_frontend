import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { crudMensajeria, listarMensajerias } from '../interfaces/mensajeria.interface';
import { Mensajeria } from '../models/mensajeria.model';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class MensajeriaService {

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

  todo() {
    const base = `${base_url}/mensajerias`;
    return this.http.get<listarMensajerias>(base, this.headers);
  }
  listar(desde: number = 0) {
    const base = `${base_url}/mensajerias?desde=${desde}`;
    return this.http.get<listarMensajerias>(base, this.headers);
  }

  listarRecibidos(desde: number = 0, data: { email: string }) {
    const base = `${base_url}/mensajerias/recibidos?desde=${desde}`;
    return this.http.post<listarMensajerias>(base, data, this.headers);
  }
  listarEnviados(desde: number = 0, data: { email: string }) {
    const base = `${base_url}/mensajerias/enviados?desde=${desde}`;
    return this.http.post<listarMensajerias>(base, data, this.headers);
  }
  listarEliminados(desde: number = 0, data: { email: string }) {
    const base = `${base_url}/mensajerias/eliminados?desde=${desde}`;
    return this.http.post<listarMensajerias>(base, data, this.headers);
  }
  
  marcarLeidoEmisor(id: number,data:{emisor:string}){
    const base = `${base_url}/mensajerias/leidoemisor/marcarleido/${id}`;
    return this.http.post<crudMensajeria>(base,data, this.headers);
  }
  marcarLeidoReceptor(id: number,data:{receptor:string}){
    const base = `${base_url}/mensajerias/leidoreceptor/marcarleido/${id}`;
    return this.http.post<crudMensajeria>(base,data, this.headers);
  }

  marcarNoLeidoEmisor(id: number, data:{emisor:string}){
    const base = `${base_url}/mensajerias/noleidoemisor/marcarnoleido/${id}`;
    return this.http.post<crudMensajeria>(base,data,this.headers);
  }
  marcarNoLeidoReceptor(id: number,data:{receptor:string}){
    const base = `${base_url}/mensajerias/noleidoreceptor/marcarnoleido/${id}`;
    return this.http.post<crudMensajeria>(base,data, this.headers);
  }

  restaurarEmisor(id: number){
    const base = `${base_url}/mensajerias/emisor/restauraremisor/paraemisor/${id}`;
    return this.http.get<crudMensajeria>(base, this.headers);
  }
  restaurarReceptor(id: number){
    const base = `${base_url}/mensajerias/receptor/restaurarreceptor/parareceptor/${id}`;
    return this.http.get<crudMensajeria>(base, this.headers);
  }

  obtener(id: number) {
    const url = `${base_url}/mensajerias/${id}`;
    return this.http.get<crudMensajeria>(url, this.headers);
  }
  crear(mensajeria: Mensajeria) {
    const base = `${base_url}/mensajerias`;
    return this.http.post<crudMensajeria>(base, mensajeria, this.headers);
  }
  borrarEmisor(id: number,data:{emisor:string}) {
    const base = `${base_url}/mensajerias/deleteemisor/${id}`;
    return this.http.post<crudMensajeria>(base,data, this.headers);
  }
  borrarReceptor(id: number,data:{receptor:string}) {
    const base = `${base_url}/mensajerias/deletereceptor/${id}`;
    return this.http.post<crudMensajeria>(base,data, this.headers);
  }




  busquedaRecibidos(termino: string, email: string) {
    const base = `${base_url}/mensajerias/busqueda/busquedarecibidos/${termino}/${email}`;
    return this.http.get<any[]>(base, this.headers)
      .pipe(
        map((resp: any) => {
          return this.transformar(resp.busquedas)
        })
      );
  }

  busquedaEnviados(termino: string, email: string) {
    const base = `${base_url}/mensajerias/busqueda/busquedaenviados/${termino}/${email}`;
    return this.http.get<any[]>(base, this.headers)
      .pipe(
        map((resp: any) => {
          return this.transformar(resp.busquedas)
        })
      );
  }

  busquedaEliminados(termino: string, email: string) {
    const base = `${base_url}/mensajerias/busqueda/busquedaeliminados/${termino}/${email}`;
    return this.http.get<any[]>(base, this.headers)
      .pipe(
        map((resp: any) => {
          return this.transformar(resp.busquedas)
        })
      );
  }

  private transformar(busquedas: any[]): Mensajeria[] {
    return busquedas.map(
      mensajeria => new Mensajeria(mensajeria.emisor, mensajeria.receptor, mensajeria.asunto, 
      mensajeria.contenido, mensajeria.fecha, mensajeria.hora, mensajeria.xemisor,mensajeria.xreceptor,
      mensajeria.lemisor,mensajeria.lreceptor,
      mensajeria.archivo, mensajeria.estado, mensajeria.id)
    );
  }
}
