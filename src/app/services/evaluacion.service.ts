import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { listarEvaluaciones } from '../interfaces/evaluacion.interface';

const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class EvaluacionService {

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
    const base= `${base_url}/evaluaciones/todo`;
    return this.http.get<listarEvaluaciones>(base, this.headers);
  }

  listar(desde:number=0){
    const base= `${base_url}/evaluaciones?desde=${desde}`;
    return this.http.get<listarEvaluaciones>(base, this.headers);
  }
}
