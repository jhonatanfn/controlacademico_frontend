import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, map, catchError } from 'rxjs/operators';
import { crudUsuario, listarUsuarios, loginUsuario } from '../interfaces/usuario';
import { Usuario } from '../models/usuario.model';
import { LoginForm } from '../interfaces/login-form.interface';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { crudDocente } from '../interfaces/docente.interface';
import { crudAlumno } from '../interfaces/alumno.interface';
import { crudApoderado } from '../interfaces/apoderado.interface';
import { crudPadre } from '../interfaces/padre.interface';
import { crudMadre } from '../interfaces/madre.interface';


const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario!: Usuario;

  constructor(private http: HttpClient, private router: Router) { }

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
  get id() {
    return this.usuario?.id || '';
  }

  todo() {
    const url = `${base_url}/usuarios/filtrado/todo`;
    return this.http.get<listarUsuarios>(url, this.headers);
  }
  crearUsuario(usuario: Usuario) {
    const url = `${base_url}/usuarios`;
    return this.http.post<crudUsuario>(url, usuario, this.headers);
  }
  obtener(id: number) {
    const url = `${base_url}/usuarios/${id}`;
    return this.http.get<crudUsuario>(url, this.headers);
  }
  usuarioPorEmail(data: { email: string }) {
    const url = `${base_url}/usuarios/consultaporemail`;
    return this.http.post<crudUsuario>(url, data, this.headers);
  }
  actualizarUsuario(usuario: Usuario) {
    const url = `${base_url}/usuarios/${usuario.id}`;
    return this.http.put<crudUsuario>(url, usuario, this.headers);
  }
  async actualizarFoto(archivo: File, id: number) {
    try {
      const url = `${base_url}/uploads/${id}`;
      const formData = new FormData();
      formData.append('imagen', archivo);
      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': this.token
        },
        body: formData
      });
      const data = await resp.json();
      return data.nombreArchivo;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  actualizarPerfil(data: { nombre: string, email: string, personaId: number }) {
    return this.http.put<crudUsuario>(`${base_url}/usuarios/${this.id}`, data, this.headers);
  }
  actualizarPassword(data: { password: string }) {
    const url = `${base_url}/usuarios/password/${this.id}`;
    return this.http.put<crudUsuario>(url, data, this.headers);
  }
  resetearPassword(id: number, data: { password: string }) {
    const url = `${base_url}/usuarios/password/${id}`;
    return this.http.put<crudUsuario>(url, data, this.headers);
  }
  login(formData: LoginForm) {
    return this.http.post<loginUsuario>(`${base_url}/auth/login`, formData)
      .pipe(
        tap((resp) => {
          localStorage.setItem('token', resp.token);
          localStorage.setItem('menu', JSON.stringify(resp.menu));
        })
      );
  }
  listarUsuarios(desde: number = 0) {
    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<listarUsuarios>(url, this.headers);
  }
  listarUsuariosPorRol(desde: number = 0, rolId: number) {
    const url = `${base_url}/usuarios/porrol/${rolId}?desde=${desde}`;
    return this.http.get<listarUsuarios>(url, this.headers);
  }
  eliminarUsuario(id: number) {
    const url = `${base_url}/usuarios/${id}`;
    return this.http.delete(url, this.headers);
  }
  validarToken(): Observable<boolean> {

    return this.http.get(`${base_url}/auth/renew`, this.headers).pipe(
      map((resp: any) => {
        const { nombre, email, role, persona, habilitado, estado, id } = resp.usuario;
        this.usuario = new Usuario(nombre, email, '', role, persona, habilitado, estado, id);
        localStorage.setItem('token', resp.token);
        return true;
      }),
      catchError(error => of(false))
    );
  }
  docentePorPersona() {
    const base = `${base_url}/docentes/persona/${this.usuario.persona.id}`;
    return this.http.get<crudDocente>(base, this.headers);
  }
  alumnoPorPersona() {
    const base = `${base_url}/alumnos/persona/${this.usuario.persona.id}`;
    return this.http.get<crudAlumno>(base, this.headers);
  }
  apoderadoPorPersona() {
    const base = `${base_url}/apoderados/persona/${this.usuario.persona.id}`;
    return this.http.get<crudApoderado>(base, this.headers);
  }
  padrePorPersona() {
    const base = `${base_url}/padres/persona/${this.usuario.persona.id}`;
    return this.http.get<crudPadre>(base, this.headers);
  }
  private transformar(busquedas: any[]): Usuario[] {
    return busquedas.map(
      usuario => new Usuario(usuario.nombre, usuario.email, '', usuario.role, usuario.persona, usuario.estado, usuario.id)
    );
  }
  buscar(termino: string) {
    const url = `${base_url}/usuarios/busqueda/${termino}`;
    return this.http.get<any[]>(url, this.headers)
      .pipe(
        map((resp: any) => {
          return this.transformar(resp.busquedas)
        })
      )
  }

  buscarporrol(termino: string, rolId: number) {
    const url = `${base_url}/usuarios/busqueda/porrol/${rolId}/${termino}`;
    return this.http.get<any[]>(url, this.headers)
      .pipe(
        map((resp: any) => {
          return this.transformar(resp.busquedas)
        })
      )
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
    this.router.navigateByUrl('login');
  }
  emailRepetido(data: { email: string }) {
    const url = `${base_url}/usuarios/verificar/email`;
    return this.http.post<crudUsuario>(url, data, this.headers);
  }
  bloquearUsuario(id: number, data: { accion: boolean }) {
    const url = `${base_url}/usuarios/habilitar/${id}`;
    return this.http.patch<crudUsuario>(url, data, this.headers);
  }

  madrePorPersona() {
    const base = `${base_url}/madres/persona/${this.usuario.persona.id}`;
    return this.http.get<crudMadre>(base, this.headers);
  }

}
