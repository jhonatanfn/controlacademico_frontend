import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import { Docente } from '../models/docente.model';
import { ProgramacionService } from '../services/programacion.service';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class IsProgramacionGuard implements CanActivate {

  public docente!: Docente;
  constructor(private usuarioService:UsuarioService,
  private programacionService:ProgramacionService,private router: Router){}


  canLoad(route: ActivatedRouteSnapshot) {
    
    this.usuarioService.docentePorPersona().subscribe(({ ok, docente }) => {
      if (ok) {
        this.docente= docente;
        this.programacionService.perteneceProgramacionDocente(
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

  canActivate(route: ActivatedRouteSnapshot){

    this.usuarioService.docentePorPersona().subscribe(({ ok, docente }) => {
      if (ok) {
        this.docente= docente;
        this.programacionService.perteneceProgramacionDocente(
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
