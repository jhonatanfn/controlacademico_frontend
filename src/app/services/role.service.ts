import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { listarRoles } from '../interfaces/role.interface';

const base_url=environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http:HttpClient) { }

  listar(){
    const token= localStorage.getItem('token') || '';
    const url = `${base_url}/roles`;
    return this.http.get<listarRoles>(url,{
      headers:{
        'x-token':token
      }
    });
  }
}
