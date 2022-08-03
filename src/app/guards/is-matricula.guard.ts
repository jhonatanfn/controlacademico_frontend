import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import { Alumno } from '../models/alumno.model';
import { MatriculaService } from '../services/matricula.service';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class IsMatriculaGuard implements CanActivate {

  public alumno!:Alumno;

  constructor(private usuarioService:UsuarioService,
  private matriculaService:MatriculaService,private router: Router){}

  canActivate(route: ActivatedRouteSnapshot) {

      this.usuarioService.alumnoPorPersona().subscribe(({ ok, alumno }) => {
        if (ok) {
          this.alumno= alumno;
          this.matriculaService.perteneceMatriculaAlumno(
            Number(route.paramMap.get('id')),
            Number(this.alumno.id)
          ).subscribe(({ok})=>{
            if(!ok){
              this.router.navigateByUrl('dashboard');
            }
          })
        }
      });
      return true;
  }
  canLoad(route: ActivatedRouteSnapshot) {
      this.usuarioService.alumnoPorPersona().subscribe(({ ok, alumno }) => {
        if (ok) {
          this.alumno= alumno;
          this.matriculaService.perteneceMatriculaAlumno(
            Number(route.paramMap.get('id')),
            Number(this.alumno.id)
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
