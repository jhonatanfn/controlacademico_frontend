import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { crudInstitucion } from '../interfaces/institucion.interface';
import { Institucion } from '../models/institucion.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class InstitucionService {

  public institucion!: Institucion;

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

  actualizar(id: number, institucion: Institucion) {
    const base = `${base_url}/instituciones/${id}`;
    return this.http.put<crudInstitucion>(base, institucion, this.headers);
  }

  getInstitucion() {

    var id = 4;
    return this.http.get<crudInstitucion>(`${base_url}/instituciones/${id}`).pipe(
      map((resp) => {
        const { nombre, direccion, telefono, email, img, departamento, provincia, distrito, centropoblado, dre, ugel, tipogestion, generoalumno, formaatencion, turnoatencion, paginaweb, estado, id } = resp.institucion;
        this.institucion = new Institucion(nombre, direccion, telefono, email, img, departamento, provincia, distrito, centropoblado, dre, ugel, tipogestion, generoalumno, formaatencion, turnoatencion, paginaweb, estado, id);
        return true;
      }),
      catchError(error => of(false))
    );
  }
  getImageUrlInstitucion(img: string) {

    if (!img) {
      return `${base_url}/uploads/no-colegio.png`;
    } else {
      if (img?.includes('https')) {
        return img;
      } else {
        if (img) {
          return `${base_url}/uploads/${img}`;
        } else {
          return `${base_url}/uploads/no-colegio.png`;
        }
      }
    }
  }
  async actualizarLogo(archivo: File, id: number) {
    try {
      const url = `${base_url}/uploads/institucion/logo/${id}`;
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
      return false;
    }
  }

}
