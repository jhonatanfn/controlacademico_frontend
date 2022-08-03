import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { listarCiclos } from '../interfaces/ciclo.interface';

const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CicloService {

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
    const base=`${base_url}/ciclos`;
    return this.http.get<listarCiclos>(base,this.headers);
  }
}
