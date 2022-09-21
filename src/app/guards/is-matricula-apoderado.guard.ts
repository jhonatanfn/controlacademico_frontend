import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Madre } from '../models/madre.model';
import { Padre } from '../models/padre.model';
import { MatriculaService } from '../services/matricula.service';
import { MatriculadetalleService } from '../services/matriculadetalle.service';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class IsMatriculaApoderadoGuard implements CanActivate {

  public padre!: Padre;
  public madre!: Madre;

  constructor(private usuarioService: UsuarioService,
    private matriculadetalleService: MatriculadetalleService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot) {

    if (this.usuarioService.usuario.role.nombre == "PADRE") {
      this.usuarioService.padrePorPersona().subscribe(({ ok, padre }) => {
        if (ok) {
          this.padre = padre;
          this.matriculadetalleService.perteneceMatriculadetallePadre(
            Number(this.padre.id),
            Number(route.paramMap.get('id'))
          ).subscribe(({ ok }) => {
            if (!ok) {
              this.router.navigateByUrl('dashboard');
            }
          });
        }
      });
    }
    if (this.usuarioService.usuario.role.nombre == "MADRE") {
      this.usuarioService.madrePorPersona().subscribe(({ ok, madre }) => {
        if (ok) {
          this.madre = madre;
          this.matriculadetalleService.perteneceMatriculadetalleMadre(
            Number(this.madre.id),
            Number(route.paramMap.get('id'))
          ).subscribe(({ ok }) => {
            if (!ok) {
              this.router.navigateByUrl('dashboard');
            }
          });
        }
      });
    }
    return true;
  }
}
