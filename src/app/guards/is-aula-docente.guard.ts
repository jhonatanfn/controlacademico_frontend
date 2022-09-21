import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router } from '@angular/router';
import { Docente } from '../models/docente.model';
import { ProgramacionService } from '../services/programacion.service';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class IsAulaDocenteGuard implements CanActivate {
  
  public docente!: Docente;
  constructor(private usuarioService:UsuarioService,
  private programacionService:ProgramacionService,private router: Router){}

  canActivate(route: ActivatedRouteSnapshot){

    this.usuarioService.docentePorPersona().subscribe(({ ok, docente }) => {
      if (ok) {
        this.docente= docente;
        this.programacionService.perteneceAulaDocente(
          Number(route.paramMap.get('id')),
          Number(this.docente.id)
        ).subscribe(({ok})=>{
          if(!ok){
            this.router.navigateByUrl('dashboard');
          }
        })
      }
    });
    return true;
  
  }


}
