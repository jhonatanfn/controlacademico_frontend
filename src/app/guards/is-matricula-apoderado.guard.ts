import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Router, UrlSegment } from '@angular/router';
import { Apoderado } from '../models/apoderado.model';
import { MatriculaService } from '../services/matricula.service';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class IsMatriculaApoderadoGuard implements CanActivate {
  
  public apoderado!:Apoderado;

  constructor(private usuarioService:UsuarioService,
    private matriculaService:MatriculaService,private router: Router){}
  
  canActivate(route: ActivatedRouteSnapshot) {

      this.usuarioService.apoderadoPorPersona().subscribe(({ ok, apoderado }) => {
        if (ok) {
          this.apoderado= apoderado;
          this.matriculaService.perteneceMatriculaApoderado(
            Number(this.apoderado.id),
            Number(route.paramMap.get('id'))
          ).subscribe(({ok})=>{
            
            if(!ok){
              this.router.navigateByUrl('dashboard');
            }
          })
        }
      });
    return true;
  }
  canLoad(route: ActivatedRouteSnapshot){
    
      this.usuarioService.apoderadoPorPersona().subscribe(({ ok, apoderado }) => {
        if (ok) {
          this.apoderado= apoderado;
          this.matriculaService.perteneceMatriculaApoderado(
            Number(this.apoderado.id),
            Number(route.paramMap.get('id'))
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
