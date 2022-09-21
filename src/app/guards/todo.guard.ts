import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class TodoGuard implements CanActivate {

  constructor(private usuarioService: UsuarioService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

    if (this.usuarioService.usuario.role.nombre === 'DOCENTE' ||
      this.usuarioService.usuario.role.nombre === 'ALUMNO' ||
      this.usuarioService.usuario.role.nombre === 'ADMINISTRADOR' ||
      this.usuarioService.usuario.role.nombre === 'APODERADO' ||
      this.usuarioService.usuario.role.nombre === 'AUXILIAR' ||
      this.usuarioService.usuario.role.nombre === 'PADRE' ||
      this.usuarioService.usuario.role.nombre === 'MADRE') {
      return true;
    } else {
      this.router.navigateByUrl('login');
      return false;
    }
  }

}
