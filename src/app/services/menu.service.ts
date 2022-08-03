import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { crudInstitucion } from '../interfaces/institucion.interface';

const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  public menu:any=[];

  constructor(private router:Router, private http: HttpClient) {}

  getTituloRuta(){
     return this.router.events
    .pipe(
      filter((event): event is ActivationEnd => event instanceof ActivationEnd),
      filter((event:ActivationEnd) => event.snapshot.firstChild === null ),
      map((event:ActivationEnd) => event.snapshot.data)
    );
  }

  cargarMenu(){
    this.menu = localStorage.getItem('menu');
    this.menu = JSON.parse(this.menu) || [];
  }

  /*
  menu:any[]=[
    {
      titulo:'Mantenimiento',
      url:'',
      toggle:'dropdown-toggle',
      submenu:[
        {
          titulo:'Areas',
          url:'areas'
        },
        {
          titulo:'Subareas',
          url:'subareas'
        }
      ]
    },
    {
      titulo:'Usuarios',
      url:'usuarios',
      toggle:'',
      submenu:[]
    },
    {
      titulo:'Roles',
      url:'roles',
      toggle:'',
      submenu:[]
    },

  ];
  */
}
