import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { listarTipoDocumento } from '../interfaces/tipodocumento';

const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class TipodocumentoService {

  
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

  listar(){
    const base= `${base_url}/tipodocumentos`;
    return this.http.get<listarTipoDocumento>(base,this.headers);
  }
}
